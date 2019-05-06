import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { UserResponse } from '../../models/user-response.models';
import { Constants } from '../../models/constants.models';
import { TabsPage } from '../tabs/tabs';
import { CartPage } from '../cart/cart';


@Component({
  selector: 'page-confirmed',
  templateUrl: 'confirmed.html',
})
export class ConfirmedPage {
  user: UserResponse;

  constructor(private events: Events, public navCtrl: NavController, public navParams: NavParams) {
    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
  }

  proceed() {
    this.navCtrl.setRoot(CartPage);
  }
  
}
  