import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Constants } from '../../models/constants.models';
import { Category } from '../../models/category.models';
import { TabsPage } from '../tabs/tabs';
import { WalkthoughPage } from '../walkthough/walkthough';

@Component({
  selector: 'page-mysplash',
  templateUrl: 'mysplash.html'
})
export class MySplashPage {

  constructor(private events: Events, public navCtrl: NavController) {
    let categories: Array<Category> = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES));
    if (categories) {
      this.done();
    } else {
      events.subscribe('category:setup', () => {
        this.done();
      });
    }
  }

  done() {
    let wt = window.localStorage.getItem('wt');
    if (wt && wt == 'shown') {
      this.navCtrl.setRoot(TabsPage);
    } else {
      this.navCtrl.setRoot(WalkthoughPage);
    }
  }

}
