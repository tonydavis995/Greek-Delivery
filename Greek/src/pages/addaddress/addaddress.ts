import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Address } from '../../models/address.models';
import { Constants } from '../../models/constants.models';
import { UserResponse } from '../../models/user-response.models';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

/**
 * Generated class for the AddaddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addaddress',
  templateUrl: 'addaddress.html',
})
export class AddaddressPage {
  private address = new Address();
  private addresses: Array<Address>;

  constructor(public navCtrl: NavController,public translate:TranslateService, private navParams: NavParams, private toastCtrl: ToastController) {
    let address: Address = this.navParams.get('address');
    if (address != null) {
      this.address = address;
    } else {
      this.address.id = -1;
      let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
      if (user != null) {
        this.address.first_name = user.first_name;
        this.address.last_name = user.last_name;
        this.address.email = user.email;
      }
    }
    this.addresses = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS_LIST));
  }

  saveAddress() {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!this.address.first_name || !this.address.first_name.length) {
			this.translate.get('field_error_name_first').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter first name');
		} else if (!this.address.last_name || !this.address.last_name.length) {
			this.translate.get('field_error_name_last').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter last name');
		} else if (!this.address.email || this.address.email.length <= 5 || !reg.test(this.address.email)) {
			this.translate.get('field_error_email').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter valid email address');
		} else if (!this.address.phone || !this.address.phone.length) {
			this.translate.get('field_error_phone').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter phone number');
		} else if (!this.address.address_1 || !this.address.address_1.length) {
			this.translate.get('field_error_address_line1').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter address line one');
		} else if (!this.address.address_2 || !this.address.address_2.length) {
			this.translate.get('field_error_address_line2').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter address line 2');
		} else if (!this.address.city || !this.address.city.length) {
			this.translate.get('field_error_city').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter city');
		} else if (!this.address.state || !this.address.state.length) {
			this.translate.get('field_error_state').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter state');
		} else if (!this.address.postcode || !this.address.postcode.length) {
			this.translate.get('field_error_postalcode').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter postcode');
		} else if (!this.address.country || !this.address.country.length) {
			this.translate.get('field_error_country').subscribe(value => {
        this.showToast(value);
      });
      // this.showToast('Enter country');
		} else {
      if (this.address.id == -1) {
        if (!this.addresses) {
          this.addresses = new Array<Address>();
        }
        this.address.id = this.addresses.length + 1;
        this.addresses.push(this.address);
      } else {
        let index = -1;
        for (let i = 0; i < this.addresses.length; i++) {
          if (this.address.id == this.addresses[i].id) {
            index = i;
            break;
          }
        }
        if (index != -1) {
          this.addresses[index] = this.address;
        }
      }
      window.localStorage.setItem(Constants.SELECTED_ADDRESS_LIST, JSON.stringify(this.addresses));
      this.navCtrl.pop();
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

}
