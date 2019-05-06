import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { OneSignal } from '@ionic-native/onesignal';

//import { AccountPage } from '../pages/account/account';
import { WalkthoughPage } from '../pages/walkthough/walkthough';
import { WordpressClient } from '../providers/wordpress-client.service';
import { Subscription } from 'rxjs/Subscription';
import { Category } from '../models/category.models';
import { UserResponse } from '../models/user-response.models';
import { APP_CONFIG, AppConfig } from './app.config';
import { AuthCredential } from '../models/auth-credential.models';
import { AuthResponse } from '../models/auth-response.models';
import { Constants } from '../models/constants.models';
import { Currency } from '../models/currency.models';
import { ShippingLine } from '../models/shipping-line.models';
import { PaymentGateway } from '../models/payment-gateway.models';
import { SigninPage } from '../pages/signin/signin';
import { OrdersPage } from '../pages/orders/orders';
import { MySplashPage } from '../pages/mysplash/mysplash';
import { TranslateService } from '../../node_modules/@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import firebase from 'firebase';

@Component({
	templateUrl: 'app.html',
	providers: [WordpressClient]
})
export class MyApp {
	deviceModel = "";
	@ViewChild(Nav) nav: Nav;
	rootPage: any = MySplashPage;

	private subscriptions: Array<Subscription> = [];
	pages: Array<{ title: string, component: any }>;
	pageCategory: number = 1;
	categoriesAll = new Array<Category>();
	user: UserResponse;

	constructor(@Inject(APP_CONFIG) private config: AppConfig,
		private globalization: Globalization, private device: Device,
		public translate: TranslateService, private events: Events,
		private alertCtrl: AlertController, private service: WordpressClient,
		public platform: Platform, public statusBar: StatusBar,
		public splashScreen: SplashScreen, private oneSignal: OneSignal) {
		let superAuth = "";
		if (config.apiBase && config.apiBase.startsWith('https') && config.consumerKey && config.consumerKey.length && config.consumerSecret && config.consumerSecret.length) {
			superAuth = ("Basic " + btoa(config.consumerKey + ":" + config.consumerSecret));
			window.localStorage.setItem(Constants.ADMIN_API_KEY, superAuth);
			this.onSuperAuthSetup(superAuth);
		} else if (config.apiBase && config.apiBase.startsWith('http:') && config.adminUsername && config.adminUsername.length && config.adminPassword && config.adminPassword.length) {
			let subscription: Subscription = service.getAuthToken(new AuthCredential(config.adminUsername, config.adminPassword)).subscribe(data => {
				let authResponse: AuthResponse = data;
				superAuth = ("Bearer " + authResponse.token);
				window.localStorage.setItem(Constants.ADMIN_API_KEY, superAuth);
				this.onSuperAuthSetup(superAuth);
			}, err => {
				console.log('auth setup error');
			});
			this.subscriptions.push(subscription);
		} else {
			console.log('auth setup error');
		}

		this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));

		this.initializeApp();
		this.listenToLoginEvents();
	}

	onSuperAuthSetup(superAuth) {
		console.log('auth setup success: ' + superAuth);
		this.loadCategories();
		this.loadCurrency();
		this.loadPaymentGateways();
		this.loadShippingLines();
	}

	listenToLoginEvents() {
		this.events.subscribe('user:login', () => {
			this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		});
	}
	// makeExitAlert(){
  //   const alert = this.alertCtrl.create({
  //     title: '',
  //     message: 'Do you want to close the app?',
  //     buttons: [{
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //             console.log('Application exit prevented!');
  //         }
  //     },{
  //         text: 'Close App',
  //         handler: () => {
  //             this.platform.exitApp(); // Close this application
  //         }
  //     }]
  //   });
  //   alert.present();
  // }

	loadCurrency() {
		let savedCurrency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
		if (!savedCurrency) {
			let subscription: Subscription = this.service.currencies(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
				let currency: Currency = data;
				window.localStorage.setItem(Constants.CURRENCY, JSON.stringify(currency));
				console.log('currency setup success');
			}, err => {
				console.log('currency setup error');
			});
			this.subscriptions.push(subscription);
		}

		// let subscription: Subscription = this.service.currencies(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
		// 	let currency: Currency = data;
		// 	window.localStorage.setItem(Constants.CURRENCY, JSON.stringify(currency));
		// 	console.log('currency setup success');
		// }, err => {
		// 	console.log('currency setup error');
		// });
		// this.subscriptions.push(subscription);

	}

	loadShippingLines() {
		let subscription: Subscription = this.service.shippingLines(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
			let shippingLines: Array<ShippingLine> = data;
			window.localStorage.setItem(Constants.SHIPPING_LINES, JSON.stringify(shippingLines));
			console.log('shippingLines setup success');
		}, err => {
			console.log('categories setup error');
		});
		this.subscriptions.push(subscription);
	}

	loadPaymentGateways() {
		let subscription: Subscription = this.service.paymentGateways(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
			let paymentGateway: Array<PaymentGateway> = data;
			window.localStorage.setItem(Constants.PAYMENT_GATEWAYS, JSON.stringify(paymentGateway));
			console.log('payment-gateway setup success');
		}, err => {
			console.log('categories setup error');
		});
		this.subscriptions.push(subscription);
	}

	loadCategories() {
		let subscription: Subscription = this.service.categories(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.pageCategory)).subscribe(data => {
			let categories: Array<Category> = data;
			if (categories.length == 0) {
				window.localStorage.setItem(Constants.PRODUCT_CATEGORIES, JSON.stringify(this.categoriesAll));
				console.log('categories setup success');
				this.events.publish('category:setup');
			} else {
				this.categoriesAll = this.categoriesAll.concat(categories);
				this.pageCategory++;
				this.loadCategories();
			}
		}, err => {
			console.log('categories setup error');
		});
		this.subscriptions.push(subscription);
	}

	initializeApp() {
		// this language will be used as a fallback when a translation isn't found in the current language
		this.translate.setDefaultLang('en');
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			firebase.initializeApp({
				apiKey: this.config.firebaseConfig.apiKey,
				authDomain: this.config.firebaseConfig.authDomain,
				databaseURL: this.config.firebaseConfig.databaseURL,
				projectId: this.config.firebaseConfig.projectId,
				storageBucket: this.config.firebaseConfig.storageBucket,
				messagingSenderId: this.config.firebaseConfig.messagingSenderId
			});

			try {
				if (this.device.model) {
					this.deviceModel = this.device.model.replace(/\s/g, '').replace(',', '').toLowerCase();
					// iphone model nos. https://gist.github.com/adamawolf/3048717
					if (this.deviceModel.indexOf("iphone103") != -1 || this.deviceModel.indexOf("iphone106") != -1 || this.deviceModel.indexOf("iphonex") != -1) {
						this.deviceModel = "iphonex";
					}
				}
			} catch (exception) { console.log(JSON.stringify(exception)); }

			if (this.platform.is('cordova')) {
				this.initOneSignal();
				// this.initOneSignal();
				console.log("cordova detected");
				this.globalization.getPreferredLanguage().then(result => {
					console.log("language detected:----" + JSON.stringify(result));
					let suitableLang = this.getSuitableLanguage(result.value);
					console.log(suitableLang);
					this.translate.use(suitableLang);
					this.setDirectionAccordingly(suitableLang);
				}).catch(e => {
					console.log(e);
					this.translate.use('en');
					this.setDirectionAccordingly('en');
				});
			} else {
				console.log("cordova not detected");
				this.translate.use('en');
				this.setDirectionAccordingly('en');
				// this.translate.use('ar');
				// this.setDirectionAccordingly('ar');
			}
		});
	}

	setDirectionAccordingly(lang: string) {
		switch (lang) {
			case 'ar': {
				this.platform.setDir('ltr', false);
				this.platform.setDir('rtl', true);
				break;
			}
			default: {
				this.platform.setDir('rtl', false);
				this.platform.setDir('ltr', true);
				break;
			}
		}
    /*this.translate.use('en');
    this.platform.setDir('ltr', false);
    this.platform.setDir('rtl', true);*/
	}

	initOneSignal() {
		if (this.config.oneSignalAppId && this.config.oneSignalAppId.length && this.config.oneSignalGPSenderId && this.config.oneSignalGPSenderId.length) {
			this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
			this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
			this.oneSignal.handleNotificationReceived().subscribe((data) => {
				// do something when notification is received
				console.log(data);
			});
			this.oneSignal.handleNotificationOpened().subscribe((data) => {
				if (data.notification.payload
					&& data.notification.payload.additionalData) {
					this.myorderPage();
				}
			});
			this.oneSignal.endInit();

			this.oneSignal.getIds().then((id) => {
				if (id.userId) {
					window.localStorage.setItem(Constants.ONESIGNAL_PLAYER_ID, id.userId.toString());
				}
			});
		}
	}

	getSideOfCurLang() {
		return this.platform.dir() === 'rtl' ? "right" : "left";
	}

	getSuitableLanguage(language) {
		language = language.substring(0, 2).toLowerCase();
		console.log('check for: ' + language);
		return this.config.availableLanguages.some(x => x.code == language) ? language : 'en';
	}

	myorderPage() {
		if (this.nav.getActive().name != 'OrdersPage')
			this.nav.setRoot(OrdersPage);
	}
}