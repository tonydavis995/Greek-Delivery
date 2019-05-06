import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, Events, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import { SigninPage } from '../signin/signin';
import { TabsPage } from '../tabs/tabs';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from 'rxjs/Subscription';
import { RegisterRequest } from '../../models/register-request.models';
import { UserResponse } from '../../models/user-response.models';
import { Constants } from '../../models/constants.models';

import { RegisterResponse } from '../../models/register-response.models';
import { AuthCredential } from '../../models/auth-credential.models';
import { AuthResponse } from '../../models/auth-response.models';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [WordpressClient]
})
export class SignupPage {
  private loading: Loading;
  private loadingShown: Boolean = false;
  private authError = "";
  private subscriptions: Array<Subscription> = [];
  private registerRequest: RegisterRequest = new RegisterRequest('', '', '');
  private registerRequestPasswordConfirm: string = '';
  private registerResponse: RegisterResponse
  countries: Array<any>;
  countryCode: string = '';
  constructor(public translate: TranslateService, private events: Events, private toastCtrl: ToastController,
    public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
    this.countries = [];
  }

  ionViewDidLoad() {
    this.getCountries();
  }

  getCountries() {
    this.service.getCountries().subscribe(data => {
      console.log("Countries fetched");
      this.countries = data;
      // console.log(data);
    }, err => {
      console.log(err);
    })
  }

  register() {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (this.registerRequest.first_name == "" || !this.registerRequest.first_name.length) {
      this.translate.get('field_error_name_first').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Please enter your first name');
    } else if (this.registerRequest.last_name == "" || !this.registerRequest.last_name.length) {
      this.translate.get('field_error_name_last').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Please enter your last name');      
    }
    if (this.registerRequest.username.length != 10) {
      this.translate.get('field_error_phone_valid').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter username atleast 4 char long');
    } else if (this.registerRequest.email.length <= 5 || !reg.test(this.registerRequest.email)) {
      this.translate.get('field_error_email').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter valid email address');
    } else if (this.registerRequest.password.length == 0 || !(this.registerRequest.password === this.registerRequestPasswordConfirm)) {
      this.translate.get('field_error_password').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter valid passwords, twice.');
    } else {
      this.translate.get('loading_sign_up').subscribe(value => {
        this.presentLoading(value);
      });
      // this.presentLoading('Registering user');
      let subscription: Subscription = this.service.createUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.registerRequest).subscribe(data => {
        this.dismissLoading();
        this.translate.get('signup_success').subscribe(value => {
          this.showToast(value);
        });
        this.registerResponse = data;
        this.verifyPhone();
        // this.showToast('Registration success.');
        // let registerResponse: RegisterResponse = data;
        // this.signIn(String(registerResponse.id), this.registerRequest.username, this.registerRequest.password);
      }, err => {
        /*this.authError = err.error.message;
				let pos = this.authError.indexOf('<a');
				if (pos != -1) {
					this.authError = this.authError.substr(0, pos) + '<a target="_blank" ' + this.authError.substr(pos + 2, this.authError.length - 1);
				}*/
        this.translate.get('signup_error').subscribe(value => {
          this.presentErrorAlert(value);
        });
        this.dismissLoading();
        //this.presentErrorAlert("Unable to register with provided credentials");
      });
      this.subscriptions.push(subscription);
    }
  }

  verifyPhone() {
    let obj = JSON.parse(JSON.stringify(this.registerRequest));
    window.localStorage.setItem('userCreateData', JSON.stringify(obj));
    this.navCtrl.push(OtpPage, { userId: this.registerResponse.id, dialCode: this.countryCode });
  }

  private signIn(userId: string, username: string, password: string) {
    let credentials: AuthCredential = new AuthCredential(username, password);
    let subscription: Subscription = this.service.getAuthToken(credentials).subscribe(data => {
      let authResponse: AuthResponse = data;
      window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
      this.getUser(userId);
    }, err => {
      this.dismissLoading();
      this.translate.get('login_error').subscribe(value => {
        this.showToast(value);
      });
      // this.presentErrorAlert("Unable to login with provided credentials");
    });
    this.subscriptions.push(subscription);
  }

  private getUser(userId: string) {
    let subscription: Subscription = this.service.getUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), userId).subscribe(data => {
      this.dismissLoading();
      let userResponse: UserResponse = data;
      window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(userResponse));
      this.navCtrl.setRoot(TabsPage);
      this.events.publish('user:login');
      this.events.publish('tab:index', 0);
    }, err => {
      this.dismissLoading();
      this.translate.get('login_error').subscribe(value => {
        this.showToast(value);
      });
      // this.presentErrorAlert("Unable to login with provided credentials");
    });
    this.subscriptions.push(subscription);
  }

  signinPage() {
    this.navCtrl.pop();
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
    this.translate.get(['error', 'dismiss'])
      .subscribe(text => {
        let alert = this.alertCtrl.create({
          title: text['error'],
          subTitle: msg,
          buttons: [text['dismiss']]
        });
        alert.present();
      })
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

}
