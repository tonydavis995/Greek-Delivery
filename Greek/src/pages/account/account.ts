import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { AddressPage } from '../address/address';
import { OrdersPage } from '../orders/orders';
import { AboutPage } from '../about/about';
import { TncPage } from '../tnc/tnc';
import { ContactPage } from '../contact/contact';
import { Constants } from '../../models/constants.models';
import { UserResponse } from '../../models/user-response.models';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  private user: UserResponse;

  constructor(public translate:TranslateService,private socialSharing: SocialSharing, private alertCtrl: AlertController, private events: Events, public navCtrl: NavController, public navParams: NavParams) {
    events.subscribe('user:login', () => {
      this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    });
  }

  ionViewDidEnter() {
    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    // this.navCtrl.push(SigninPage);
  }

  profile() {
    this.navCtrl.push(ProfilePage);
  }

  address() {
    this.navCtrl.push(AddressPage, { choose: false });
  }

  orders() {
    this.navCtrl.push(OrdersPage);
  }

  about() {
    this.navCtrl.push(AboutPage);
  }

  tnc() {
    this.navCtrl.push(TncPage);
  }

  contact() {
    this.navCtrl.push(ContactPage);
  }

  shareApp() {
    this.socialSharing.share('Hey, I found this delivery app.', null, null, 'https://play.google.com/store/apps/details?id=com.techlytx.greekdelivery')
    .then((res) => {
      console.log("Shared");
    }).catch((err) => {
      console.log(JSON.stringify(err));
    });
  }

  signIn() {
    // this.navCtrl.push(SigninPage);
    this.events.publish('tab:index', 0);
    this.events.publish('go:to', 'auth');
  }

  logout() {
    let errortitle=this.translate.instant('logout');
    let alert = this.alertCtrl.create({
      title: errortitle,
      message: this.translate.instant('logout_message'),
      buttons: [{
        text: this.translate.instant('yes'),
        handler: () => {
          this.user = null;
          this.events.publish('tab:index', 0);
          window.localStorage.setItem(Constants.USER_KEY, null);
        }
      },
      {
        text: this.translate.instant('no'),
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    alert.present();
  }

}
