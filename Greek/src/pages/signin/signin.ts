import { Component, Inject } from '@angular/core';
import { Platform, IonicPage, ModalController, NavController, NavParams, Loading, Events, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { PasswordPage } from '../password/password';
import { SignupPage } from '../signup/signup';
import { PhonePage } from '../phone/phone';
import { TabsPage } from '../tabs/tabs';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthCredential } from '../../models/auth-credential.models';
import { UserResponse } from '../../models/user-response.models';
import { RegisterResponse } from '../../models/register-response.models';
import { RegisterRequest } from '../../models/register-request.models';
import { Constants } from '../../models/constants.models';
import { AuthResponse } from '../../models/auth-response.models';
import { Address } from '../../models/address.models';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { APP_CONFIG, AppConfig } from "../../app/app.config";
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook'
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
  providers: [WordpressClient]
})

export class SigninPage {
  private loading: Loading;
  private loadingShown: Boolean = false;
  private authError = "";
  private subscriptions: Array<Subscription> = [];
  private credentials: AuthCredential = new AuthCredential('', '');
  private registerResponse: RegisterResponse;
  private registerRequest: RegisterRequest = new RegisterRequest('', '', '');
  buttonDisabled: Boolean = true;
  token: any = window.localStorage.getItem(Constants.ADMIN_API_KEY);

  constructor(@Inject(APP_CONFIG) public config: AppConfig, public facebook: Facebook,
    public translate: TranslateService, private events: Events,
    private modalCtrl: ModalController, private alertCtrl: AlertController,
    private toastCtrl: ToastController, public navCtrl: NavController,
    private service: WordpressClient, private loadingCtrl: LoadingController,
    public google: GooglePlus, public platform: Platform) {
    /*if (this.userLoggedIn()) {
      navCtrl.setRoot(TabsPage);
    }*/
  }

  private userLoggedIn(): boolean {
    let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    return user != null;
  }

  loginFB(): void {
    this.translate.get('loging_fb').subscribe(value => {
      this.presentLoading(value);
    });
    // this.presentLoading('Logging in Facebook');
    if (this.platform.is('cordova')) {
      this.fbOnPhone();
    } else {
      this.fbOnBrowser();
    }
  }

  loginGoogle(): void {
    this.translate.get('loging_google').subscribe(value => {
      this.presentLoading(value);
    });
    // this.presentLoading('Logging in Google+');
    if (this.platform.is('cordova')) {
      this.googleOnPhone();
    } else {
      this.googleOnBrowser();
    }
  }

  googleOnPhone() {
    const provider = {
      'webClientId': this.config.firebaseConfig.webApplicationId,
      'offline': false,
      'scopes': 'profile email'
    };
    console.log("In cordova");
    console.log("Calling google in cordova");
    this.google.login(provider)
      .then((res) => {
        this.dismissLoading();
        this.translate.get('google_success_auth1').subscribe(value => {
          this.presentLoading(value);
        });
        // this.presentLoading('Google signup success, authenticating with firebase');
        const googleCredential = firebase.auth.GoogleAuthProvider
          .credential(res.idToken);
        firebase.auth().signInWithCredential(googleCredential)
          .then((response) => {
            this.registerRequest.email = response.email;
            this.registerRequest.first_name = this.getNames(response.displayName).first_name;
            this.registerRequest.last_name = this.getNames(response.displayName).last_name;
            this.dismissLoading();
            this.translate.get('google_success_auth2').subscribe(value => {
              this.presentLoading(value);
            });
            // this.presentLoading('Firebase authenticated google signup, creating user..');
            this.checkUser();
          })
      }, (err) => {
        console.error("Error: ", err)
        this.dismissLoading();
      })
  }

  getNames(displayName) {
    let obj = { first_name: '', last_name: '' };
    if (!displayName.length || displayName == "") {
      return obj;
    }
    var names = displayName.split(" ");
    obj.first_name = names[0];
    for (let i = 0; i < names.length; i++) {
      if (names[i] != obj.first_name && names[i] != "" && names[i].length > 0) {
        obj.last_name = names[i];
        break;
      }
    }
    return obj;
  }

  googleOnBrowser() {
    try {
      console.log("In not cordova");
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          this.registerRequest.email = result.user.email;
          this.registerRequest.first_name = this.getNames(result.user.displayName).first_name;
          this.registerRequest.last_name = this.getNames(result.user.displayName).last_name;
          console.log(this.registerRequest);
          this.dismissLoading();
          this.translate.get('google_success_auth2').subscribe(value => {
            this.presentLoading(value);
          });
          // this.presentLoading('Firebase authenticated google signup, creating user..');
          this.checkUser();
          console.log(result);
        }).catch((error) => {
          console.log(error);
          this.dismissLoading();
        });
    } catch (err) {
      console.log(err)
    }
  }

  fbOnPhone() {
    console.log("In cordova");
    this.facebook.login(["public_profile", 'user_friends', 'email'])
      .then(response => {
        this.dismissLoading();
        this.translate.get('fb_success_auth1').subscribe(value => {
          this.presentLoading(value);
        });
        // this.presentLoading('Facebook signup success, authenticating with firebase');
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);
        window.localStorage.setItem(Constants.USER_API_KEY, response.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
          .then(success => {
            this.registerRequest.email = success.email;
            this.registerRequest.first_name = this.getNames(success.displayName).first_name;
            this.registerRequest.last_name = this.getNames(success.displayName).last_name;
            this.dismissLoading();
            this.translate.get('fb_success_auth2').subscribe(value => {
              this.presentLoading(value);
            });
            // this.presentLoading('Firebase authenticated Facebook login, creating user..');
            this.checkUser();
          });
      }).catch((error) => {
        console.log(error);
        // this.showToast("Error in Facebook login");
        this.dismissLoading();
      });
  }

  fbOnBrowser() {
    console.log("In not cordova");
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    provider.addScope('user_friends');
    provider.addScope('email');
    provider.addScope('public_profile');
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        this.registerRequest.email = result.user.email;
        this.registerRequest.first_name = this.getNames(result.user.displayName).first_name;
        this.registerRequest.last_name = this.getNames(result.user.displayName).last_name;
        this.dismissLoading();
        this.translate.get('fb_success_auth2').subscribe(value => {
          this.presentLoading(value);
        });
        // this.presentLoading('Firebase authenticated Facebook login, creating user..');
        this.checkUser();
      }).catch((error) => {
        console.log(error);
        this.dismissLoading();
        // this.showToast("Facebook login unsuccessfull");
      });
  }

  checkUser() {
    this.dismissLoading();
    const component = this;
    component.translate.get('check_token').subscribe(value => {
      component.presentLoading(value);
    });
    // component.presentLoading("Getting the user token");
    firebase.auth().currentUser.getIdToken(false)
      .then(function (idToken) {
        component.dismissLoading();
        component.translate.get('check_user').subscribe(value => {
          component.presentLoading(value);
        });
        // component.presentLoading("Checking the user");
        component.service.checkToken(window.localStorage.getItem(Constants.ADMIN_API_KEY), idToken)
          .subscribe(data => {
            console.log("User exist:---");
            console.log(JSON.stringify(data));
            // user exists
            let authResponse = data;
            window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
            component.getUser(component.getUserIdFromToken(authResponse.token));
            component.dismissLoading();
          }, err => {
            // if error code is 404, user not exists
            console.log("User not exist");
            component.dismissLoading();
            component.verifyPhone();
          });
      }).catch(function (error) {
        console.log("error");
      });
  }

  verifyPhone() {
    let obj = JSON.parse(JSON.stringify(this.registerRequest));
    window.localStorage.setItem('userCreateData', JSON.stringify(obj));
    this.navCtrl.push(PhonePage);
  }

  singIn() {
    if (this.credentials.username.length == 0 || this.credentials.password.length == 0) {
      this.translate.get('login_box_empty').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Username or Password cannot be empty!');
    } else {
      this.translate.get('loging').subscribe(value => {
        this.presentLoading(value);
      });
      // this.presentLoading('Logging in');
      let subscription: Subscription = this.service.getAuthToken(this.credentials).subscribe(data => {
        let authResponse: AuthResponse = data;
        window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
        this.getUser(this.getUserIdFromToken(authResponse.token));
      }, err => {
        this.authError = err.error.message;
        let pos = this.authError.indexOf('<a');
        if (pos != -1) {
          this.authError = this.authError.substr(0, pos) + '<a target="_blank" ' + this.authError.substr(pos + 2, this.authError.length - 1);
        }
        this.dismissLoading();
        //this.presentErrorAlert("Unable to login with provided credentials");
      });
      this.subscriptions.push(subscription);
    }
  }

  private getUser(userId: string) {
    let subscription: Subscription = this.service.getUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), userId).subscribe(data => {
      this.dismissLoading();
      let userResponse: UserResponse = data;
      window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(userResponse));
      if (userResponse.billing && userResponse.billing.address_1 && userResponse.billing.address_1.length && userResponse.billing.address_2 && userResponse.billing.address_2.length) {
        userResponse.billing.id = -100;
        let addresses = new Array<Address>();
        addresses.push(userResponse.billing);
        window.localStorage.setItem(Constants.SELECTED_ADDRESS, JSON.stringify(userResponse.billing));
        window.localStorage.setItem(Constants.SELECTED_ADDRESS_LIST, JSON.stringify(addresses));
      }
      this.navCtrl.setRoot(TabsPage);
      this.events.publish('user:login');
      this.events.publish('tab:index', 0);
    }, err => {
      this.dismissLoading();
      this.translate.get('login_error').subscribe(value => {
        this.presentErrorAlert(value);
      });
      // this.presentErrorAlert("Unable to login with provided credentials");
    });
    this.subscriptions.push(subscription);
  }

  private getUserIdFromToken(token: string): string {
    let decodedString: string = window.atob(token.split(".")[1]);
    return JSON.parse(decodedString).data.user.id;
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
    // let alert = this.alertCtrl.create({
    //   title: this.translate.get('error'),
    //   subTitle: msg,
    //   buttons: [this.translate.get('dismiss')]
    // });
    // alert.present();
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

  signupPage() {
    this.navCtrl.push(SignupPage);
  }

  homePage() {
    this.navCtrl.setRoot(TabsPage);
  }

  passwordPage() {
    this.navCtrl.push(PasswordPage);
  }
}
