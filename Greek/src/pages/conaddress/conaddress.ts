import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConpaymentPage } from '../conpayment/conpayment';
import { Global } from '../../providers/global';
import { CartItem } from '../../models/cart-item.models';
import { Address } from '../../models/address.models';
import { Product } from '../../models/product.models';
import { Currency } from '../../models/currency.models';
import { Constants } from '../../models/constants.models';
import { AddressPage } from '../address/address';
import { Coupon } from '../../models/coupon.models';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'page-conaddress',
  templateUrl: 'conaddress.html',
  providers: [Global]
})
export class ConaddressPage {
  private cartItems: Array<CartItem>;
  private selectedAddress: Address;
  private editMainCart: boolean = false;
  private deliveryPayble: string = '0';
  private currencyIcon: string = '';
  private currencyText: string = '';
  private totalItems = 0;
  private total = 0;
  private totalToShow = "0";

  constructor(public translate:TranslateService,public navCtrl: NavController, private navParams: NavParams, private global: Global, private toastCtrl: ToastController) {
    this.cartItems = this.navParams.get('cart');
    this.totalItems = this.navParams.get('totalItems');
    this.total = this.navParams.get('total');

    let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    if (currency) {
      this.currencyText = currency.value;
      let iconText = currency.options[currency.value];
      this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
    }
    this.deliveryPayble = this.currencyIcon + ' ' + this.deliveryPayble;

    let coupon: Coupon = JSON.parse(window.localStorage.getItem(Constants.SELECTED_COUPON));
    if (coupon) {
      this.totalToShow = this.currencyIcon + ' ' + this.total;
    } else {
      this.totalToShow = this.currencyIcon + ' ' + this.totalItems;
    }
  }

  ionViewDidEnter() {
    this.selectedAddress = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS));
  }

  newAddress() {
    this.navCtrl.push(AddressPage, { choose: true });
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

  paymentPage() {
    if (this.selectedAddress == null) {
      this.translate.get('select_address').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Please select an address.');
    } else {
      this.navCtrl.push(ConpaymentPage, { cart: this.cartItems, totalItems: this.totalItems, total: this.total });
    }
  }

}
