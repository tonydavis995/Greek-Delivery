import { Component,ViewEncapsulation, Inject,ViewChild} from '@angular/core';
import { Slides,NavController,Platform, Loading, ModalController, ToastController, AlertController, LoadingController, MenuController, Events } from 'ionic-angular';
import { ItemsinfoPage } from '../itemsinfo/itemsinfo';
import { SearchPage } from '../search/search';
import { Global } from '../../providers/global';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from 'rxjs/Subscription';
import { Category } from '../../models/category.models';
import { Product } from '../../models/product.models';
import { Constants } from '../../models/constants.models';
import { CartPage } from '../cart/cart';
import { Currency } from '../../models/currency.models';
import { CartItem } from '../../models/cart-item.models';
import { SigninPage } from '../signin/signin';
import { Banner } from '../../models/banner.models';
import { AppConfig, APP_CONFIG } from '../../app/app.config';
import { ConfirmedPage } from '../confirmed/confirmed';
import { SignupPage } from '../signup/signup';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [WordpressClient, Global],
  encapsulation: ViewEncapsulation.None
})
export class HomePage {
  @ViewChild(Slides) slider: Slides;
  private loading: Loading;
  private loadingShown: Boolean = false;
  private resetCartCountDone: Boolean = false;

  private subscriptions: Array<Subscription> = [];
  private categoriesAll = new Array<Category>();
  private banners = new Array<Banner>();
  private selectedCategoryIdx: number = 0;
  private products = new Array<Array<Product>>();
  private productsPage: Array<number>;
  private cartItems: Array<CartItem>;
  private currencyIcon: string;
  private currencyText: string;
  private appTitle;

  constructor(@Inject(APP_CONFIG) private config: AppConfig,public platform: Platform,public translateService:TranslateService, private events: Events, public modalCtrl: ModalController, private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, public menu: MenuController, private global: Global, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
   
    // this.navCtrl.push(SigninPage);
    // this.presentErrorAlert("Hello");
    this.appTitle = config.appName;
    let categories: Array<Category> = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES));
    let cats = new Array<Category>();
    for (let cat of categories) {
      if (Number(cat.parent) == 0 && Number(cat.count) > 0) {
        cats.push(cat);
      }
    }
    this.categoriesAll = cats;
    this.cartItems = global.getCartItems();

    this.products = JSON.parse(window.localStorage.getItem('productsAll'));
    if (!this.products) {
      this.products = new Array<Array<Product>>(this.categoriesAll.length);
    }
    //this.productsPage = JSON.parse(window.localStorage.getItem('pagesAll'));
    if (!this.productsPage) {
      this.productsPage = new Array<number>();
      for (let i = 0; i < this.categoriesAll.length; i++) {
        this.productsPage.push(1);
      }
    }
    this.loadProducts(this.selectedCategoryIdx);
    this.loadBanners();
    this.checkstatus();
    
    

    events.publish('cart:count', this.cartItems.length);
    events.subscribe('go:to', (to) => {
      if (to == 'auth') {
        this.translateService.get('no_sign_in').subscribe(value => {
          this.showToast(value);
        });
        this.navCtrl.push(SigninPage);
      }
    });
  }

  loadBanners() {
    let savedBanners: Array<Banner> = JSON.parse(window.localStorage.getItem('banners'));
    if (savedBanners && savedBanners.length) {
      this.banners = savedBanners;
    }
    let subscription: Subscription = this.service.banners(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
      let banners: Array<Banner> = data;
      let categories: Array<Category> = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES));
      for (let ban of banners) {
        for (let cat of categories) {
          if (cat.id == ban.category) {
            ban.catObj = cat;
            break;
          }
        }
      }
      this.banners = banners;
      window.localStorage.setItem('banners', JSON.stringify(this.banners));
    }, err => {
    });
    this.subscriptions.push(subscription);
  }

  ionViewWillLeave() {
    window.localStorage.setItem('productsAll', JSON.stringify(this.products));
    window.localStorage.setItem('pagesAll', JSON.stringify(this.productsPage));
  }
  // makeExitAlert(){
  //   const alert = this.alertCtrl.create({
  //     title: '',
  //     message: 'Do you want to close the app?',
  //     buttons: [{
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //             console.log('Application exit prevented!');
  //         }
  //     },{
  //         text: 'Close App',
  //         handler: () => {
  //             this.platform.exitApp(); // Close this application
  //         }
  //     }]
  //   });
  //   alert.present();
  // }


  ngAfterViewInit() {
    this.slider.freeMode = true;
  }

  ionViewDidEnter() {
    if (this.translateService.currentLang == 'ar') { 
      this.slider._rtl = true 
    }
    let change = window.localStorage.getItem('changed');
    if (change && change == 'changed') {
      window.localStorage.setItem('changed', 'null');
      this.global.refreshCartItems();
      this.cartItems = this.global.getCartItems();
      this.events.publish('cart:count', this.cartItems.length);
      this.resetCartCount();
    }

    if (!this.resetCartCountDone) {
      this.resetCartCount();
    }
    // this.navCtrl.push(SignupPage);
  }

  resetCartCount() {
    this.resetCartCountDone = true;
    if (this.products) {
      for (let pros of this.products) {
        if (pros) {
          for (let pro of pros) {
            pro.quantity = 0;
            for (let ci of this.cartItems) {
              if (pro.id == ci.product_id) {
                pro.quantity = ci.quantity;
                break;
              }
            }
          }
        }
      }
    }
  }
  checkstatus() {
    let countDownHour = new Date("Jun 7, 2019 22:00:00").getHours();
    let countDownMin = new Date("Jun 7, 2019 22:00:00").getMinutes();
    let countDownSec = new Date("Jun 7, 2019 22:00:00").getSeconds();
    var cD = 0;
    if(countDownHour > 12) {
      cD = countDownHour - 12;

    } else {
      cD = countDownHour;
    }
    let countvalue = Math.floor((cD*60*60)+(countDownMin*60)+(countDownSec))
   
    

    // Update the count down every 1 second
    let x = setInterval(function () {

      // Get todays date and time
      let nowD = new Date().getHours();
      let nowM = new Date().getMinutes();
      let nowS = new Date().getSeconds();
      var nD = 0;
      if(nowD > 12) {
      nD = nowD - 12;

      } else {
      nD = nowD;
     }
      var nowvalue = Math.floor((nD*60*60)+(nowM*60)+(nowS))

      // Find the distance between now and the count down date
    

      // Output the result in an element with id="demo"
    

      // If the count down is over, write some text 
      console.log(nowD)
      console.log(nowvalue)
      console.log(countvalue)
      var distance = countvalue - nowvalue;
        // Time calculations for days, hours, minutes and seconds
        let hours = Math.floor((distance) / (60 * 60));
        let minutes = Math.floor((distance % ( 60 * 60)) / (60));
        let seconds = Math.floor((distance % (60 * 60))%(60));
        console.log( "distance", distance);
      if (nowD <= 10 || nowD >= 22) {
        
      
       
        document.getElementById("demo").innerHTML = "Order between 10am-10pm";
      } else {
        
      
        document.getElementById("demo").innerHTML ="Time left to order " + hours + "h "
        + minutes + "m " + seconds + "s ";
      }
      
     
    }, 1000);
    
   
    
  }

  loadProducts(catIndex: number) {
    
    if (!this.products[catIndex] || !this.products[catIndex].length) {
      this.presentLoading('loading ' + this.categoriesAll[catIndex].name + ' products');
    }

    this.productsPage[catIndex] = 1;

    let subscription: Subscription = this.service.productsByCategory(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.categoriesAll[catIndex].id), String(this.productsPage[catIndex])).subscribe(data => {
      this.dismissLoading();
      let response: Array<Product> = data;
      let products = new Array<Product>();
      for (let pro of response) {
        if (pro.type == 'grouped' || pro.type == 'external' || !pro.purchasable)
          continue;
        pro.quantity = 0;
        for (let ci of this.cartItems) {
          if (pro.id == ci.product_id) {
            pro.quantity = ci.quantity;
            break;
          }
        }
        console.log(pro)
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
        products.push(pro);
      }
      this.products[catIndex] = products;
    }, err => {
      this.dismissLoading();
    });
    this.subscriptions.push(subscription);
    
  }

  doInfinite(infiniteScroll: any) {
    this.productsPage[this.selectedCategoryIdx]++;
    let page = this.productsPage[this.selectedCategoryIdx];
    let subscription: Subscription = this.service.productsByCategory(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.categoriesAll[this.selectedCategoryIdx].id), String(page)).subscribe(data => {
      let response: Array<Product> = data;
      if (!response || !response.length) {
        this.productsPage[this.selectedCategoryIdx]--;
      }
      for (let pro of response) {
        if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
          continue;
        pro.quantity = 0;
        for (let ci of this.cartItems) {
          if (pro.id == ci.product_id) {
            pro.quantity = ci.quantity;
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

        this.products[this.selectedCategoryIdx].push(pro);
      }
      infiniteScroll.complete();
    }, err => {
      this.productsPage[this.selectedCategoryIdx]--;
      infiniteScroll.complete();
      console.log(err);
    });
    this.subscriptions.push(subscription);
  }

  itemsinfo(pro) {
    this.navCtrl.push(ItemsinfoPage, { pro: pro });
  }

  goToSearch() {
    this.events.publish('tab:index', 1);
  }

  decrementProduct(pro) {
    var decremented: boolean = this.global.decrementCartItem(pro);
    if (decremented) {
      pro.quantity = pro.quantity - 1;
      this.events.publish('cart:count', this.cartItems.length);
    }
  }

  incrementProduct(pro) {
    let added: Boolean = this.global.addCartItem(pro);
    pro.quantity = pro.quantity + 1;
    if (added) {
      this.events.publish('cart:count', this.cartItems.length);
    }
  }

  addToCart(pro) {
    if (pro.in_stock && pro.purchasable) {
      let added: boolean = this.global.addCartItem(pro);
      let cartToast=added ? 'card_update1' : 'card_update2';
      this.translateService.get(cartToast).subscribe(value => {
        this.showToast(value);
      });
      this.events.publish('cart:count', this.global.getCartItems().length);
    } else {
      this.translateService.get('item_empty').subscribe(value => {
        this.showToast(value);
      });
    }
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

  private presentErrorAlert(msg: string) {
    this.translateService.get(['error', 'dismiss'])
    .subscribe(text => {
      let alert = this.alertCtrl.create({
        title: text['error'],
        subTitle: msg,
        buttons: [text['dismiss']]
      });
      alert.present();
    })
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

  // wishlistPage() {
  //   this.navCtrl.push(WishlistPage);
  // }

  searchPage() {
    let modal = this.modalCtrl.create(SearchPage);
    modal.present();
  }

  cartPage() {
    let modal = this.modalCtrl.create(CartPage);
    modal.present();
  }

  
}
