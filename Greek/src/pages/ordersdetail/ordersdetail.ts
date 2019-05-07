import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../models/order.models';

/**
 * Generated class for the OrdersdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ordersdetail',
  templateUrl: 'ordersdetail.html',
})
export class OrdersdetailPage {
  private order: Order;
  private orderProgress: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.order = navParams.get('order');
    if (this.order.status.toLowerCase() == 'completed') {
      this.orderProgress = 3;
      this.order.status = 'Completed'
    } else if (this.order.status.toLowerCase() == 'processing') {
      this.orderProgress = 2;
      this.order.status = 'Fishing'
    } else if (this.order.status.toLowerCase() == 'pending') {
      this.orderProgress = 1;
      this.order.status = 'Pending Approval at Greek'
    }
  }

}
