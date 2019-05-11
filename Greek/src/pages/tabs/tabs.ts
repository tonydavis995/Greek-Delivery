import { Component, ViewChild } from '@angular/core';
import { Events, Tabs, NavController, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { FavoritesPage } from '../favorites/favorites';
import { AccountPage } from '../account/account';
import { Global } from '../../providers/global';


@Component({
  templateUrl: 'tabs.html',
  providers: [Global]
})
export class TabsPage {
  @ViewChild('tabs') tabRef: Tabs;


  tab1Root = HomePage;
  tab2Root = SearchPage;
  tab3Root = CartPage;
  tab4Root = FavoritesPage;
  tab5Root = AccountPage;

  cartCount: number = 0;

  constructor(private events: Events,public navCtrl: NavController,public platform: Platform, private global: Global) {
    // let bacbutton = platform.registerBackButtonAction(() => {
    //     let tabPrv = this.tabRef.previousTab(false);//Remember pass false
    //     if (tabPrv) this.tabRef.select(tabPrv.index);//Here you go back to prv Tab
    //     bacbutton();
    //   },1)
    events.subscribe('cart:count', (count) => {
      this.cartCount = count;
    });
  }

  ionViewDidEnter() {
    this.events.subscribe('tab:index', (index) => {
      if (index && index != -1) { this.tabRef.select(index);
       }
    });
  }

}
