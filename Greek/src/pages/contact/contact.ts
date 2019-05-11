import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '../../../node_modules/@ionic-native/call-number';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  latitude:number = 9.896735;
	longitude:number = 76.707022;

  constructor( private callNumber: CallNumber, public navCtrl: NavController, public navParams: NavParams) {
  }

  dial() {
    this.callNumber.callNumber("+917012800595", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

 

  openMap() {
		window.open('https://www.google.com/maps/dir/?api=1&destination=' + this.latitude + ',' + this.longitude);
	}

}
