import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ItemsinfoPage } from '../itemsinfo/itemsinfo';
import { Product } from '../../models/product.models';
import { Global } from '../../providers/global';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
  providers: [Global]
})
export class FavoritesPage {
  private products = new Array<Product>();

  constructor(private global: Global, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.global.refreshFavorites();
    this.products = this.global.getFavorites();
  }

  itemsinfo(pro) {
    this.navCtrl.push(ItemsinfoPage, { pro: pro });
  }

}
