import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Globalization } from '@ionic-native/globalization';

import { APP_CONFIG, BaseAppConfig } from "./app.config";

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { AddaddressPage } from '../pages/addaddress/addaddress';
import { AddressPage } from '../pages/address/address';
import { CartPage } from '../pages/cart/cart';
import { ConaddressPage } from '../pages/conaddress/conaddress';
import { ConpaymentPage } from '../pages/conpayment/conpayment';
import { PaymentPage } from '../pages/payment/payment';
import { ConfirmedPage } from '../pages/confirmed/confirmed';
import { ContactPage } from '../pages/contact/contact';
import { FavoritesPage } from '../pages/favorites/favorites';
import { HomePage } from '../pages/home/home';
import { ItemsinfoPage } from '../pages/itemsinfo/itemsinfo';
import { OrdersPage } from '../pages/orders/orders';
import { OrdersdetailPage } from '../pages/ordersdetail/ordersdetail';
import { PasswordPage } from '../pages/password/password';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TncPage } from '../pages/tnc/tnc';
import { WalkthoughPage } from '../pages/walkthough/walkthough';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PayPal } from '@ionic-native/paypal';
import { MySplashPage } from '../pages/mysplash/mysplash';
import { OtpPage } from '../pages/otp/otp';
import { PhonePage } from '../pages/phone/phone';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { CodePage } from '../pages/code/code';
import { Facebook } from '@ionic-native/facebook'
import { GooglePlus } from '@ionic-native/google-plus';
import { OneSignal } from '@ionic-native/onesignal';
import { Device } from '@ionic-native/device';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AccountPage,
    AddaddressPage,
    AddressPage,
    CartPage,
    ConaddressPage,
    ConpaymentPage,
    ConfirmedPage,
    ContactPage,
    FavoritesPage,
    HomePage,
    ItemsinfoPage,
    OrdersPage,
    OrdersdetailPage,
    PasswordPage,
    ProfilePage,
    SearchPage,
    SigninPage,
    SignupPage,
    TabsPage,
    TncPage,
    WalkthoughPage,
    PaymentPage,
    MySplashPage,
    CodePage,OtpPage,PhonePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AccountPage,
    AddaddressPage,
    AddressPage,
    CartPage,
    ConaddressPage,
    ConpaymentPage,
    ConfirmedPage,
    ContactPage,
    FavoritesPage,
    HomePage,
    ItemsinfoPage,
    OrdersPage,
    OrdersdetailPage,
    PasswordPage,
    ProfilePage,
    SearchPage,
    SigninPage,
    SignupPage,
    TabsPage,
    TncPage,
    WalkthoughPage,
    PaymentPage,
    MySplashPage,
    CodePage,OtpPage,PhonePage
  ],
  providers: [
    Device,
    StatusBar,
    SplashScreen,
    PayPal,
    SocialSharing,
    InAppBrowser,
    CallNumber,
    EmailComposer,
    Globalization,
    Facebook,
    GooglePlus,
    OneSignal,
    { provide: APP_CONFIG, useValue: BaseAppConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
