import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '../../../node_modules/@ionic-native/call-number';
import { EmailComposer } from '../../../node_modules/@ionic-native/email-composer';

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
  latitude:number = 28.634418;
	longitude:number = 77.219184;

  constructor(private emailComposer: EmailComposer, private callNumber: CallNumber, public navCtrl: NavController, public navParams: NavParams) {
  }

  dial() {
    this.callNumber.callNumber("+19876543210", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  mail() {
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        let email = {
          to: 'help@foodmallrestro.com',
          subject: 'Contact Foodmall',
          body: '',
          isHtml: true
        };
        // Send a text message using default options
        this.emailComposer.open(email);
      }
    });
  }

  openMap() {
		window.open('https://www.google.com/maps/dir/?api=1&destination=' + this.latitude + ',' + this.longitude);
	}

}
