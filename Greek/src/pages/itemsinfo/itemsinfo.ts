import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, Loading, LoadingController } from 'ionic-angular';
import { Global } from '../../providers/global';
import { Product } from '../../models/product.models';
import { CartItem } from '../../models/cart-item.models';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { Constants } from '../../models/constants.models';
import { Image } from '../../models/image.models';
import { Currency } from '../../models/currency.models';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

/**
 * Generated class for the ItemsinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-itemsinfo',
  templateUrl: 'itemsinfo.html',
  providers: [Global, WordpressClient]
})

export class ItemsinfoPage {
  private loading: Loading;
  private loadingShown: Boolean = false;

  private pro: Product;
  private quantity: number = 0;
  private cartTotal: number = 0;
  private cartSize: number = 0
  private favorite: boolean;
  private currencyIcon: string;
  private currencyText: string;
  private productVariations = new Array<Product>();
  private subscriptions: Array<Subscription> = [];
  private cartItems = new Array<CartItem>();

  constructor(private service: WordpressClient, private events: Events, 
    public navCtrl: NavController, private toastCtrl: ToastController, 
    private loadingCtrl: LoadingController, private global: Global, 
    private navParams: NavParams,public translateService:TranslateService) {
    this.pro = this.navParams.get('pro');
    if (this.pro) {
      this.pro.favorite = global.isFavorite(this.pro);
      this.cartItems = global.getCartItems();
      for (let ci of this.cartItems) {
        this.cartSize = this.cartSize + 1;
        this.cartTotal = this.cartTotal + Number(ci.product.sale_price) * ci.quantity;
        if (this.pro.id == ci.product_id) {
          this.quantity = ci.quantity;
        }
      }
      this.favorite = global.isFavorite(this.pro);
      if (this.pro.type == 'variable') {
        this.loadVariations();
      }
    } else { navCtrl.pop(); }
  }

  loadVariations() {
    this.translateService.get('no_sign_in').subscribe(value => {
      this.presentLoading(value);
    });
    let subscription: Subscription = this.service.productVariations(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.pro.id).subscribe(data => {
      let variations: Array<Product> = data;
      for (let vari of variations) {
        let variAttris = '';
        for (let i = 0; i < vari.attributes.length; i++) {
          let attri = vari.attributes[i].name + ' ' + vari.attributes[i].option + (i < vari.attributes.length - 1 ? ', ' : '');
          variAttris = variAttris + attri;
        }

        vari.name = this.pro.name + ' - ' + variAttris;
        vari.type = 'variable';
        vari.images = new Array<Image>();
        vari.images.push(vari.image);
        vari.categories = this.pro.categories;

        vari.quantity = 0;
        for (let ci of this.cartItems) {
          if (vari.id == ci.product_id) {
            vari.quantity = ci.quantity;
            break;
          }
        }

        if (!this.currencyText) {
          let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
          if (currency) {
            this.currencyText = currency.value;
            let iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
          }
        }
        if (!vari.sale_price) {
          vari.sale_price = vari.regular_price;
        }
        if (this.currencyIcon) {
          vari.regular_price_html = this.currencyIcon + ' ' + vari.regular_price;
          vari.sale_price_html = this.currencyIcon + ' ' + vari.sale_price;
        } else if (this.currencyText) {
          vari.regular_price_html = this.currencyText + ' ' + vari.regular_price;
          vari.sale_price_html = this.currencyText + ' ' + vari.sale_price;
        }
      }
      this.productVariations = variations;
      this.dismissLoading();
    }, err => {
    });
    this.subscriptions.push(subscription);
  }

  toggleFavorite() {
    this.favorite = this.global.toggleFavorite(this.pro);
  }

  decrement() {
    var decremented: boolean = this.global.decrementCartItem(this.pro);
    if (decremented) {
      this.quantity = this.quantity - 1;
      this.calculateTotal();
    }
  }

  increment() {
    this.global.addCartItem(this.pro);
    this.quantity = this.quantity + 1;
    this.calculateTotal();
  }

  decrementItem(pro) {
    var decremented: boolean = this.global.decrementCartItem(pro);
    if (decremented) {
      pro.quantity = pro.quantity - 1;
      this.calculateTotal();
    }
  }

  incrementItem(pro) {
    this.global.addCartItem(pro);
    pro.quantity = pro.quantity + 1;
    this.calculateTotal();
  }

  calculateTotal() {
    window.localStorage.setItem('changed', 'changed');
    this.cartItems = this.global.getCartItems();
    let sum: number = 0;
    this.cartSize = this.cartItems.length;
    for (let item of this.cartItems) {
      sum = sum + Number(item.product.sale_price) * item.quantity;
    }
    this.cartTotal = sum;
  }

  goToCart() {
    this.navCtrl.pop();
    this.events.publish('tab:index', 2);
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

  private presentLoading(message: string) {
    this.loading = this.loadingCtrl.create({
      content: message
    });

    this.loading.onDidDismiss(() => { });

    this.loading.present();
    this.loadingShown = true;
  }

  private dismissLoading() {
    if (this.loadingShown) {
      this.loadingShown = false;
      this.loading.dismiss();
    }
  }

}
