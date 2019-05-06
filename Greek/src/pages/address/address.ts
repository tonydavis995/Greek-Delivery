import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ModalController, ViewController, ToastController } from 'ionic-angular';
import { AddaddressPage } from '../addaddress/addaddress';
import { Address } from '../../models/address.models';
import { Constants } from '../../models/constants.models';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { UserResponse } from '../../models/user-response.models';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
  providers: [WordpressClient]
})
export class AddressPage {
  private addresses = new Array<Address>();
  private choose: boolean;
  private loading: Loading;
  private loadingShown: Boolean = false;
  private subscriptions: Array<Subscription> = [];

  constructor(private navParams: NavParams,public translate:TranslateService, public navCtrl: NavController, public modalCtrl: ModalController, public viewCtrl: ViewController, private toastCtrl: ToastController, private service: WordpressClient, private loadingCtrl: LoadingController) {
    this.choose = navParams.get('choose');
  }

  ionViewDidEnter() {
    let addresses = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS_LIST));
    if (addresses != null) {
      this.addresses = addresses;
    }
  }

  selectAddress(address) {
    if (this.choose) {
      for (let add of this.addresses) {
        if (add.id == -100) {
          add.id = address.id;
          break;
        }
      }

      address.id = -100;
      let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
      user.billing = address;
      user.shipping = address;
      user.first_name = address.first_name;
      user.last_name = address.last_name;
      window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(user));
      window.localStorage.setItem(Constants.SELECTED_ADDRESS, JSON.stringify(address));
      this.translate.get('Just a moment').subscribe(value => {
        this.presentLoading(value);
      });
      // this.presentLoading('Just a moment');
      let subscription: Subscription = this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(user.id), user).subscribe(data => {
        this.dismissLoading();
        this.navCtrl.pop();
      }, err => {
        this.dismissLoading();
        this.navCtrl.pop();
      });
      this.subscriptions.push(subscription);
    } else {
      this.navCtrl.push(AddaddressPage, { address: address });
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

  editAddress(address) {
    this.navCtrl.push(AddaddressPage, { address: address });
  }

  addaddress() {
    this.navCtrl.push(AddaddressPage);
  }

}
