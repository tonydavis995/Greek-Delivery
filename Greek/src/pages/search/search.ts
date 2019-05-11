import { Component } from '@angular/core';
import { IonicPage, Platform, NavController,Events, NavParams, ViewController, ModalController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { ItemsinfoPage } from '../itemsinfo/itemsinfo';
import { TabsPage } from '../tabs/tabs';
import { Global } from '../../providers/global';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { Product } from '../../models/product.models';
import { Currency } from '../../models/currency.models';
import { Constants } from '../../models/constants.models';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [WordpressClient, Global]
})
export class SearchPage {
  private query: string;
  private currencyIcon: string;
  private currencyText: string;
  private subscriptions: Array<Subscription> = [];
  private products = new Array<Product>();
  private productsAllPage: number = 1;
  private queryHistory = new Array<string>();
  private cantScroll:Boolean=false;
  constructor(public translate:TranslateService,private events: Events,private navParams: NavParams, public platform: Platform, public modalCtrl: ModalController, private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, private global: Global, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    {
      //   let bacbutton = platform.registerBackButtonAction(() => {
      //     this.navCtrl.setRoot(TabsPage);
      //     bacbutton();
        
      // },2)
    }
  }

  doSearch() {
    let subscription: Subscription = this.service.productsByQuery(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.query, String(this.productsAllPage)).subscribe(data => {
      let response: Array<Product> = data;
      let products = new Array<Product>();
      for (let pro of response) {
        if (pro.type == 'grouped' || pro.type == 'external' || !pro.purchasable)
          continue;
        if (!this.currencyText) {
          let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
          if (currency) {
            this.currencyText = currency.value;
            let iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
          }
        }
        if (!pro.sale_price) {
          pro.sale_price = pro.regular_price;
        }
        if (this.currencyIcon) {
          pro.regular_price_html = this.currencyIcon + ' ' + pro.regular_price;
          pro.sale_price_html = this.currencyIcon + ' ' + pro.sale_price;
        } else if (this.currencyText) {
          pro.regular_price_html = this.currencyText + ' ' + pro.regular_price;
          pro.sale_price_html = this.currencyText + ' ' + pro.sale_price;
        }
        pro.favorite = this.global.isFavorite(pro);
        products.push(pro);
      }
      this.products = products;
    }, err => {
    });
    this.subscriptions.push(subscription);
  }

  doInfinite(infiniteScroll: any) {
    this.productsAllPage++;
    let subscription: Subscription = this.service.productsByQuery(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.query, String(this.productsAllPage)).subscribe(data => {
      let products: Array<Product> = data;
      for (let pro of products) {
        if (!pro.purchasable)
          continue;
        if (!this.currencyText) {
          let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
          if (currency) {
            this.currencyText = currency.value;
            let iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
          }
        }
        if (!pro.sale_price) {
          pro.sale_price = pro.regular_price;
        }
        if (this.currencyIcon) {
          pro.regular_price_html = this.currencyIcon + ' ' + pro.regular_price;
          pro.sale_price_html = this.currencyIcon + ' ' + pro.sale_price;
        } else if (this.currencyText) {
          pro.regular_price_html = this.currencyText + ' ' + pro.regular_price;
          pro.sale_price_html = this.currencyText + ' ' + pro.sale_price;
        }
        pro.favorite = this.global.isFavorite(pro);
        this.products.push(pro);
      }
      infiniteScroll.complete();
    }, err => {
      infiniteScroll.complete();
      console.log(err);
    });
    this.subscriptions.push(subscription);
  }
  // makeExitAlert(){
  //   this.navCtrl.setRoot(HomePage);
  // }


  itemdetailPage(pro) {
    this.navCtrl.push(ItemsinfoPage, { pro: pro });
  }

  clearHistory() {
    this.global.clearSearchHistory();
    this.queryHistory = new Array<string>();
  }

  search(q) {
    this.query = q;
    this.productsAllPage = 1;
    this.doSearch();
    this.global.addInSearchHistory(q);
    this.translate.get('searching').subscribe(value => {
      this.showToast(value);
    });
    // this.showToast('Searching...');
  }

  getItems(searchbar: any) {
    var q = searchbar.srcElement.value;
    if (!q) { return; }
    this.search(q);
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}
