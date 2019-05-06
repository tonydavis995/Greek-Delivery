import { Component, ViewChild } from '@angular/core';
import { Events, Tabs } from 'ionic-angular';
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

  constructor(private events: Events, private global: Global) {
    events.subscribe('cart:count', (count) => {
      this.cartCount = count;
    });
  }

  ionViewDidEnter() {
    this.events.subscribe('tab:index', (index) => {
      if (index && index != -1) { this.tabRef.select(index); }
    });
  }

}
