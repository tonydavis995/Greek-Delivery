import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, AlertController, LoadingController, ToastController, Events } from 'ionic-angular';
import { ConfirmedPage } from '../confirmed/confirmed';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from 'rxjs/Subscription';
import { PaymentGateway } from '../../models/payment-gateway.models';
import { CartItem } from '../../models/cart-item.models';
import { Address } from '../../models/address.models';
import { OrderRequest } from '../../models/order-request.models';
import { OrderResponse } from '../../models/order-response.models';
import { UserResponse } from '../../models/user-response.models';
import { Constants } from '../../models/constants.models';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser';
import { PayPalPayment, PayPalConfiguration, PayPal } from '@ionic-native/paypal';
import { Currency } from '../../models/currency.models';
import { APP_CONFIG, AppConfig } from '../../app/app.config';
import * as sha512 from 'js-sha512';
import { Coupon } from '../../models/coupon.models';
import { TabsPage } from '../tabs/tabs';
import { OrderUpdateRequest } from '../../models/order-update-request.models';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'page-conpayment',
  templateUrl: 'conpayment.html',
  providers: [WordpressClient]
})
export class ConpaymentPage {
  private loading: Loading;
  private loadingShown: Boolean = false;
  private placedPagePushed: Boolean = false;
	private paymentDone: Boolean = false;
	private paymentFailAlerted: Boolean = false;

  private subscriptions: Array<Subscription> = [];
  private paymentGateways = new Array<PaymentGateway>();
  private cartItems: Array<CartItem>;
  private selectedPaymentGateway;
  private selectedAddress: Address;
  private orderRequest: OrderRequest;
  private orderResponse: OrderResponse;
  private user: UserResponse;
  private totalItems = 0;
  private total = 0;
  private couponApplied = false;
  private deliveryPayble: string = '0';
  private currencyIcon: string = '';
  private currencyText: string = '';
  private totalToShow: string = '';
  private coupon: Coupon;

  constructor(@Inject(APP_CONFIG) private config: AppConfig,public translateService:TranslateService, private events: Events, private iab: InAppBrowser, private payPal: PayPal, private toastCtrl: ToastController, public navCtrl: NavController, private navParams: NavParams, private service: WordpressClient, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.cartItems = this.navParams.get('cart');
    this.totalItems = this.navParams.get('totalItems');
    this.total = this.navParams.get('total');
    let paymentGateways = JSON.parse(window.localStorage.getItem(Constants.PAYMENT_GATEWAYS));
    this.selectedAddress = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS));
    if (paymentGateways != null) {
      for (let pg of paymentGateways) {
        if (pg.enabled && this.paymentImplemented(pg.id)) {
          this.paymentGateways.push(pg);
        }
      }
    }

    let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    if (currency) {
      this.currencyText = currency.value;
      let iconText = currency.options[currency.value];
      this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
    }

    this.coupon = JSON.parse(window.localStorage.getItem(Constants.SELECTED_COUPON));
    if (this.coupon) {
      this.totalToShow = this.currencyIcon + ' ' + this.total;
    } else {
      this.totalToShow = this.currencyIcon + ' ' + this.totalItems;
    }
  }

  paymentImplemented(id) {
    return id === "paypal" || id === "ppec_paypal" || id === "pumcp" || id === "payuindia" || id === "cod";
  }


  paymentMethod(paymentGateway) {
    this.selectedPaymentGateway = paymentGateway;
  }

  placedPage() {
    if (this.selectedPaymentGateway == null) {
      this.translateService.get('select_method').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Choose payment method.');
    } else {
      this.orderRequest = new OrderRequest();
      this.orderRequest.payment_method = this.selectedPaymentGateway.id;
      this.orderRequest.payment_method_title = this.selectedPaymentGateway.title;
      this.orderRequest.set_paid = false;
      this.orderRequest.billing = this.selectedAddress;
      this.orderRequest.shipping = this.selectedAddress;
      this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
      this.orderRequest.customer_id = String(this.user.id);
      this.orderRequest.line_items = this.cartItems;
      for (let item of this.orderRequest.line_items) {
        item.product = null;
      }
      this.translateService.get('Creating order').subscribe(value => {
        this.presentLoading(value);
      });
      let subscription: Subscription = this.service.createOrder(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.orderRequest).subscribe(data => {
        this.orderResponse = data;
        if (this.coupon) {
          let couponSubs: Subscription = this.service.applyCouponCode(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.orderResponse.id), this.coupon.code).subscribe(data => {
            this.couponApplied = true;
            window.localStorage.removeItem(Constants.SELECTED_COUPON);
            // this.showToast('Coupon applied');
            this.translateService.get('Coupon applied').subscribe(value => {
              this.showToast(value);
            });
            this.orderPlaced();
          }, err => {
            console.log(err);
            this.dismissLoading();
          });
          this.subscriptions.push(couponSubs);
        } else {
          this.orderPlaced();
        }
      }, err => {
        this.dismissLoading();
      });
      this.subscriptions.push(subscription);
    }
  }

  orderPlaced() {
    this.dismissLoading();
    if (this.selectedPaymentGateway.id === "paypal") {
      this.initPayPal();
    } else if (this.selectedPaymentGateway.id === "ppec_paypal") {
      this.initPayPal();
    } else if (this.selectedPaymentGateway.id === "pumcp" || this.selectedPaymentGateway.id === "payuindia") {
      this.initPayUMoney();
    } else if (this.selectedPaymentGateway.id === "cod") {
      this.clearCart();
      this.navCtrl.setRoot(ConfirmedPage);
    } else {
      this.translateService.get('processed_cod').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Processed via Cash on delivery');
      this.clearCart();
      this.navCtrl.setRoot(ConfirmedPage);
    }
  }

  // Example sandbox response
  //
  // {
  //   "client": {
  //     "environment": "sandbox",
  //     "product_name": "PayPal iOS SDK",
  //     "paypal_sdk_version": "2.16.0",
  //     "platform": "iOS"
  //   },
  //   "response_type": "payment",
  //   "response": {
  //     "id": "PAY-1AB23456CD789012EF34GHIJ",
  //     "state": "approved",
  //     "create_time": "2016-10-03T13:33:33Z",
  //     "intent": "sale"
  //   }
  // }

  initPayPal() {
    this.payPal.init({ PayPalEnvironmentProduction: this.config.paypalProduction, PayPalEnvironmentSandbox: this.config.paypalSandbox }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender(this.config.paypalProduction ? 'PayPalEnvironmentProduction' : 'PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
        let payment = new PayPalPayment(String(this.couponApplied ? this.total : this.totalItems), currency.value, 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(() => {
          this.paymentSuccess();
          // Successfully paid
        }, () => {
          this.paymentFailure();
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  }

  initPayUMoney() {
		let name = this.user.username;
		let mobile = '9873194659';
		let email = this.user.email;
		let bookingId = String(Math.floor(Math.random() * (99 - 10 + 1) + 10)) + String(this.orderResponse.id);
		let productinfo = this.orderResponse.order_key;
		let salt = this.config.payuSalt;
		let key = this.config.payuKey;
		let amt = this.couponApplied ? this.total : this.totalItems;
		let string = key + '|' + bookingId + '|' + amt + '|' + productinfo + '|' + name + '|' + email + '|||||||||||' + salt;
		// let encrypttext = sha512(string);

    let url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&salt=" + salt + "&key=" + key;
		// let url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&hash=" + encrypttext + "&salt=" + salt + "&key=" + key;

		let options: InAppBrowserOptions = {
			location: 'yes',
			clearcache: 'yes',
			zoom: 'yes',
			toolbar: 'no',
			closebuttoncaption: 'back'
		};
		const browser: any = this.iab.create(url, '_blank', options);
		browser.on('loadstop').subscribe(event => {
			browser.executeScript({
				file: "payumoney/payumoneyPaymentGateway.js"
			});

			if (event.url == "http://localhost/success.php") {
				this.paymentSuccess();
				browser.close();
			}
			if (event.url == "http://localhost/failure.php") {
				this.paymentFailure();
				browser.close();
			}
		});
		browser.on('exit').subscribe(event => {
			if (!this.paymentDone && !this.paymentFailAlerted) {
				this.paymentFailure();
			}
		});
		browser.on('loaderror').subscribe(event => {
      this.translateService.get('Something went wrong').subscribe(value => {
        this.showToast(value);
      });
			// this.showToast('Something went wrong');
		});
	}

  paymentFailure() {
		this.paymentFailAlerted = true;
		let subscription: Subscription = this.service.updateOrder(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.orderResponse.id), new OrderUpdateRequest('cancelled')).subscribe(data => {
		}, err => {
			console.log(err);
		});
		this.subscriptions.push(subscription);

		let alert = this.alertCtrl.create({
			title: "{{'Payment failure' | translate}}",
			message:"{{'pymt_fail_msg' | translate}}",
			buttons: [{
				text: "{{'okay' | translate}}",
				role: 'cancel',
				handler: () => {
					this.done();
					console.log('Okay clicked');
				}
			}]
		});
		alert.present();
	}

  paymentSuccess() {
		this.paymentDone = true;
		this.clearCart();
    this.translateService.get('Just a moment').subscribe(value => {
      this.presentLoading(value);
    });
		// this.presentLoading('Just a moment');
		let subscription: Subscription = this.service.updateOrder(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.orderResponse.id), { set_paid: true }).subscribe(data => {
			this.done();
		}, err => {
			this.done();
			this.paymentSuccess();
			console.log(err);
		});
		this.subscriptions.push(subscription);
	}

	done() {
		if (!this.placedPagePushed) {
			this.placedPagePushed = true;
			this.dismissLoading();
			this.navCtrl.setRoot(this.paymentFailAlerted ? TabsPage : ConfirmedPage);
		}
	}

  private presentLoading(message: string) {
    this.loading = this.loadingCtrl.create({
      content: message
    });

    this.loading.onDidDismiss(() => { });

    this.loading.present();
    this.loadingShown = true;
  }

  private dismissLoading() {
    if (this.loadingShown) {
      this.loadingShown = false;
      this.loading.dismiss();
    }
  }

  private presentErrorAlert(msg: string) {
    let alert = this.alertCtrl.create({
      title: "{{'error' | translate}}",
      subTitle: msg,
      buttons: ["{{'dismiss' | translate}}"]
    });
    alert.present();
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  clearCart() {
    let cartItems = new Array<CartItem>();
    window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
    this.events.publish('cart:count', cartItems.length);
  }

}
