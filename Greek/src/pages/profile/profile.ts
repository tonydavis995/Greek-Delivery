import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../models/constants.models';
import { UserResponse } from '../../models/user-response.models';
import { Address } from '../../models/address.models';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private user: UserResponse;
  private selectedAddress: Address;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    this.selectedAddress = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS));
  }

  isReadonly() { return true; }

}
