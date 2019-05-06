import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, Events, ModalController } from 'ionic-angular';
import { ConaddressPage } from '../conaddress/conaddress';
import { Global } from '../../providers/global';
import { CartItem } from '../../models/cart-item.models';
import { Constants } from '../../models/constants.models';
import { UserResponse } from '../../models/user-response.models';
import { SigninPage } from '../signin/signin';
import { Currency } from '../../models/currency.models';
import { Coupon } from '../../models/coupon.models';
import { CodePage } from '../code/code';
import { ConfirmedPage } from '../confirmed/confirmed';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
  providers: [Global]
})

export class CartPage {
  private cartItems = new Array<CartItem>();
  private discount: number = 0;
  private discount_html: string;
  private couponAmount: string = '0';
  private total: number = 0;
  private total_items = 0;
  private total_items_html: string = '0';
  private total_html: string = '0';
  private checkoutText: string;
  private currencyIcon: string = '';
  private currencyText: string = '';
  private coupon: Coupon;

  constructor(public modalCtrl: ModalController,public translateService:TranslateService,
  private events: Events, private global: Global, public navCtrl: NavController, 
  private toastCtrl: ToastController) {
    let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    if (currency) {
      this.currencyText = currency.value;
      let iconText = currency.options[currency.value];
      this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
    }
    this.discount_html = this.currencyIcon + this.discount;
    window.localStorage.removeItem(Constants.SELECTED_COUPON);
  }

  ionViewDidEnter() {
    this.global.refreshCartItems();
    this.cartItems = this.global.getCartItems();
    this.calculateTotal();
  }

  removeItem(product) {
    this.global.removeCartItem(product);
    this.cartItems = this.global.getCartItems();
    this.calculateTotal();
  }

  decrementItem(product) {
    var decremented: boolean = this.global.decrementCartItem(product);
    this.cartItems = this.global.getCartItems();
    this.calculateTotal();
  }

  incrementItem(product) {
    var incremented: boolean = this.global.incrementCartItem(product);
    if (incremented) {
      this.total = this.total + Number(product.sale_price);
      window.localStorage.setItem('changed', 'changed');
    }
    this.cartItems = this.global.getCartItems();
    this.calculateTotal();
  }

  calculateTotal() {
    window.localStorage.setItem('changed', 'changed');
    let sum: number = 0;
    for (let item of this.cartItems) {
      sum = sum + Number(item.product.sale_price) * item.quantity;
    }

    this.total_items = sum;
    this.total = (sum - (this.coupon ? this.coupon.discount_type == 'percent' ? (sum * Number(this.coupon.amount) / 100) : Number(this.coupon.amount) : 0));
    this.total_items_html = this.currencyIcon + ' ' + this.total_items;
    this.total_html = this.currencyIcon + ' ' + this.total;

    this.events.publish('cart:count', this.cartItems.length);
    if (!this.cartItems || !this.cartItems.length) {
      this.checkoutText = 'Cart is empty';
    } else {
      this.checkoutText = 'Proceed to confirm order';
    }
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

  proceedCheckout() {
    if (this.cartItems != null && this.cartItems.length > 0) {
      let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
      if (user != null) {
        if (!this.coupon) {
          window.localStorage.removeItem(Constants.SELECTED_COUPON);
        }
        this.navCtrl.push(ConaddressPage, { cart: this.cartItems, totalItems: this.total_items, total: this.total });
      } else {
        this.events.publish('tab:index', 0);
        this.events.publish('go:to', 'auth');
      }
    }
  }

  codePage() {
    let modal = this.modalCtrl.create(CodePage);
    modal.onDidDismiss(() => {
      let coupon: Coupon = JSON.parse(window.localStorage.getItem(Constants.SELECTED_COUPON));
      if (coupon) {
        if (coupon.discount_type == 'fixed_product') {
          let allowed = false;
          for (let itemCA of coupon.product_ids) {
            for (let item of this.cartItems) {
              if (itemCA == Number(item.product_id)) {
                allowed = true;
                break;
              }
            }
            if (allowed) { break; }
          }
          if (allowed) {
            this.coupon = coupon;
            this.couponAmount = this.currencyIcon + ' ' + this.coupon.amount + (this.coupon.discount_type == 'percent' ? '%' : '');
            this.calculateTotal();
          }
        } else {
          this.coupon = coupon;
          this.couponAmount = this.currencyIcon + ' ' + this.coupon.amount + (this.coupon.discount_type == 'percent' ? '%' : '');
          this.calculateTotal();
        }
      }
    });
    modal.present();
  }

}
