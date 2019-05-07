webpackJsonp([0],{

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Constants; });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.ADMIN_API_KEY = 'AdminApiKey';
    Constants.USER_API_KEY = 'UserApiKey';
    Constants.USER_KEY = 'UserKey';
    Constants.PRODUCT_CATEGORIES = 'ProductCategories';
    Constants.PAYMENT_GATEWAYS = 'PaymentGateways';
    Constants.SHIPPING_LINES = 'ShippingLines';
    Constants.SELECTED_ADDRESS = 'SelectedAddress';
    Constants.SELECTED_COUPON = 'SelectedCoupon';
    Constants.SELECTED_ADDRESS_LIST = 'AddressList';
    Constants.CURRENCY = 'Currency';
    Constants.ONESIGNAL_PLAYER_ID = 'OneSignalPlayerID';
    Constants.ONESIGNAL_PLAYER_ID_REGISTERED = 'OneSignalPlayerIDRegistered';
    return Constants;
}());

//# sourceMappingURL=constants.models.js.map

/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrdersPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ordersdetail_ordersdetail__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_order_update_request_models__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var OrdersPage = /** @class */ (function () {
    function OrdersPage(translate, toastCtrl, navCtrl, service, loadingCtrl, alertCtrl) {
        var _this = this;
        this.translate = translate;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingShown = false;
        this.subscriptions = [];
        this.orders = new Array();
        this.pageNo = 1;
        this.currencyIcon = '';
        this.currencyText = '';
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].USER_KEY));
        this.translate.get('loading_orders').subscribe(function (value) {
            _this.presentLoading(value);
            _this.loadMyOrders();
        });
        // this.presentLoading('loading orders');
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
        }
    }
    OrdersPage.prototype.loadMyOrders = function () {
        var _this = this;
        var subscription = this.service.myOrders(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var order = data_1[_i];
                order.status = order.status.charAt(0).toUpperCase() + order.status.substring(1);
                order.total_html = _this.currencyIcon + ' ' + order.total;
                for (var _a = 0, _b = order.line_items; _a < _b.length; _a++) {
                    var line = _b[_a];
                    line.price_html = _this.currencyIcon + ' ' + line.price;
                }
            }
            _this.dismissLoading();
            _this.orders = data;
        }, function (err) {
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    OrdersPage.prototype.cancelOrder = function (order) {
        var _this = this;
        this.translate.get('cancelling_orders').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('Cancelling order');
        var subscription = this.service.updateOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(order.id), new __WEBPACK_IMPORTED_MODULE_5__models_order_update_request_models__["a" /* OrderUpdateRequest */]('cancelled')).subscribe(function (data) {
            var orderRes = data;
            order.status = 'cancelled';
            order.status = order.status.charAt(0).toUpperCase() + order.status.substring(1);
            /* for(let o of this.orders) {
                console.log(String(o.id) == String(orderRes.id));
                if(o.id == orderRes.id) {
                    o = orderRes;
                    console.log('here');
                    this.orders = this.orders;
                    break;
                }
            } */
            _this.dismissLoading();
            _this.translate.get('order_cancelled').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Order cancelled');
        }, function (err) {
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    OrdersPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.pageNo++;
        var subscription = this.service.myOrders(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(function (data) {
            var orders = data;
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var order = data_2[_i];
                order.status = order.status.charAt(0).toUpperCase() + order.status.substring(1);
                order.total_html = _this.currencyIcon + ' ' + order.total;
                for (var _a = 0, _b = order.line_items; _a < _b.length; _a++) {
                    var line = _b[_a];
                    line.price_html = _this.currencyIcon + ' ' + line.price;
                }
            }
            infiniteScroll.complete();
        }, function (err) {
            infiniteScroll.complete();
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    OrdersPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    OrdersPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    OrdersPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    OrdersPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    OrdersPage.prototype.orderDetail = function (order) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__ordersdetail_ordersdetail__["a" /* OrdersdetailPage */], { order: order });
    };
    OrdersPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-orders',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/orders/orders.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{\'my_orders\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <!-- <p padding-left>Pending Orders</p> -->\n\n    <ion-list  no-lines>\n\n        <ion-item *ngFor="let order of orders" class="preparing" (click)="orderDetail(order)">\n\n            <ion-avatar item-start>\n\n                <!-- <ion-icon name="md-restaurant"></ion-icon> -->\n\n            </ion-avatar>\n\n            <h2>{{\'order\'}} #{{order.id}}\n\n                <small>{{\'view\' | translate}} {{order.line_items.length}} {{\'items\' | translate}}</small>\n\n            </h2>\n\n            <p>{{order.status}}\n\n                <small>{{order.date_created}}</small>\n\n            </p>\n\n        </ion-item>\n\n        <!-- <ion-item class="preparing" >\n\n            <ion-avatar item-start>\n\n                <ion-icon name="md-restaurant"></ion-icon>\n\n            </ion-avatar>\n\n            <h2>Order #24565\n\n                <small>View 3 items</small>\n\n            </h2>\n\n            <p>Confirmed\n\n                <small>11/23/45</small>\n\n            </p>\n\n        </ion-item> -->\n\n    </ion-list>\n\n    <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n\n        <ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n    </ion-infinite-scroll>\n\n\n\n    <div *ngIf="!orders || !orders.length" class="empty">\n\n        <div>\n\n            <img src="assets/imgs/empty.png">\n\n            <p>{{\'empty_orders\' | translate}}!</p>\n\n        </div>\n\n    </div>\n\n\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/orders/orders.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], OrdersPage);
    return OrdersPage;
}());

//# sourceMappingURL=orders.js.map

/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__itemsinfo_itemsinfo__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SearchPage = /** @class */ (function () {
    function SearchPage(translate, navParams, platform, modalCtrl, toastCtrl, navCtrl, service, global, loadingCtrl, alertCtrl) {
        var _this = this;
        this.translate = translate;
        this.navParams = navParams;
        this.platform = platform;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.global = global;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.subscriptions = [];
        this.products = new Array();
        this.productsAllPage = 1;
        this.queryHistory = new Array();
        this.cantScroll = false;
        {
            platform.ready().then(function () {
                platform.registerBackButtonAction(function () {
                    _this.makeExitAlert();
                });
            });
        }
    }
    SearchPage.prototype.doSearch = function () {
        var _this = this;
        var subscription = this.service.productsByQuery(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.query, String(this.productsAllPage)).subscribe(function (data) {
            var response = data;
            var products = new Array();
            for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
                var pro = response_1[_i];
                if (pro.type == 'grouped' || pro.type == 'external' || !pro.purchasable)
                    continue;
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                pro.favorite = _this.global.isFavorite(pro);
                products.push(pro);
            }
            _this.products = products;
        }, function (err) {
        });
        this.subscriptions.push(subscription);
    };
    SearchPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.productsAllPage++;
        var subscription = this.service.productsByQuery(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.query, String(this.productsAllPage)).subscribe(function (data) {
            var products = data;
            for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
                var pro = products_1[_i];
                if (!pro.purchasable)
                    continue;
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                pro.favorite = _this.global.isFavorite(pro);
                _this.products.push(pro);
            }
            infiniteScroll.complete();
        }, function (err) {
            infiniteScroll.complete();
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    SearchPage.prototype.makeExitAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: '',
            message: 'Do you want to close the app?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel'
                }, {
                    text: 'Close App',
                    handler: function () {
                        _this.platform.exitApp(); // Close this application
                    }
                }]
        });
        alert.present();
    };
    SearchPage.prototype.itemdetailPage = function (pro) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__itemsinfo_itemsinfo__["a" /* ItemsinfoPage */], { pro: pro });
    };
    SearchPage.prototype.clearHistory = function () {
        this.global.clearSearchHistory();
        this.queryHistory = new Array();
    };
    SearchPage.prototype.search = function (q) {
        var _this = this;
        this.query = q;
        this.productsAllPage = 1;
        this.doSearch();
        this.global.addInSearchHistory(q);
        this.translate.get('searching').subscribe(function (value) {
            _this.showToast(value);
        });
        // this.showToast('Searching...');
    };
    SearchPage.prototype.getItems = function (searchbar) {
        var q = searchbar.srcElement.value;
        if (!q) {
            return;
        }
        this.search(q);
    };
    SearchPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 1000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SearchPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-search',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/search/search.html"*/'<ion-header class="bg-transparent">\n\n  <ion-navbar>\n\n    <ion-title>\n\n      <ion-searchbar (ionInput)="getItems($event)" [debounce]="1000" \n\n      placeholder="{{\'search_box\' | translate}}?"></ion-searchbar>\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <div class="recent-searchs" padding-left padding-right padding-bottom margin-bottom>\n\n    <p>{{\'Recent searches\' | translate}}</p>\n\n    <ion-list no-lines>\n\n      <ion-item *ngFor="let query of queryHistory" (click)="search(query)">\n\n        {{query}}\n\n      </ion-item>\n\n    </ion-list>\n\n  </div>\n\n  <div class="offers">\n\n    <p padding-left padding-right *ngIf="products && products.length">{{\'Search results\' | translate}}</p>\n\n    <ion-scroll scrollX="true" style="height:195px;white-space: nowrap;">\n\n      <ion-card *ngFor="let pro of products" (click)="itemdetailPage(pro)">\n\n        <img *ngIf="pro.images && pro.images.length" data-src="{{pro.images[0].src}}">\n\n        <img *ngIf="pro.images == null || pro.images.length == 0" src="assets/imgs/img_1.png">\n\n        <div class="flex">\n\n          <p>\n\n            <small [innerHTML]="pro.name"></small>\n\n            <br [innerHTML]="pro.categories[0].name">\n\n          </p>\n\n          <span *ngIf="pro.type == \'simple\'" [innerHTML]="pro.sale_price_html"></span>\n\n          <span *ngIf="pro.type == \'variable\'" [innerHTML]="pro.price_html"></span>\n\n        </div>\n\n      </ion-card>\n\n    </ion-scroll>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/search/search.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], SearchPage);
    return SearchPage;
}());

//# sourceMappingURL=search.js.map

/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddressPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__addaddress_addaddress__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AddressPage = /** @class */ (function () {
    function AddressPage(navParams, translate, navCtrl, modalCtrl, viewCtrl, toastCtrl, service, loadingCtrl) {
        this.navParams = navParams;
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.viewCtrl = viewCtrl;
        this.toastCtrl = toastCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.addresses = new Array();
        this.loadingShown = false;
        this.subscriptions = [];
        this.choose = navParams.get('choose');
    }
    AddressPage.prototype.ionViewDidEnter = function () {
        var addresses = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST));
        if (addresses != null) {
            this.addresses = addresses;
        }
    };
    AddressPage.prototype.selectAddress = function (address) {
        var _this = this;
        if (this.choose) {
            for (var _i = 0, _a = this.addresses; _i < _a.length; _i++) {
                var add = _a[_i];
                if (add.id == -100) {
                    add.id = address.id;
                    break;
                }
            }
            address.id = -100;
            var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].USER_KEY));
            user.billing = address;
            user.shipping = address;
            user.first_name = address.first_name;
            user.last_name = address.last_name;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(user));
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS, JSON.stringify(address));
            this.translate.get('Just a moment').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Just a moment');
            var subscription = this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(user.id), user).subscribe(function (data) {
                _this.dismissLoading();
                _this.navCtrl.pop();
            }, function (err) {
                _this.dismissLoading();
                _this.navCtrl.pop();
            });
            this.subscriptions.push(subscription);
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__addaddress_addaddress__["a" /* AddaddressPage */], { address: address });
        }
    };
    AddressPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    AddressPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    AddressPage.prototype.editAddress = function (address) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__addaddress_addaddress__["a" /* AddaddressPage */], { address: address });
    };
    AddressPage.prototype.addaddress = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__addaddress_addaddress__["a" /* AddaddressPage */]);
    };
    AddressPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-address',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/address/address.html"*/'<!--\n\n  Generated template for the AddressPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>{{\'my_address\' | translate}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content class="bg-light">\n\n  <ion-list no-lines *ngIf="addresses && addresses.length">\n\n    <ion-item *ngFor="let address of addresses">\n\n      <ion-label>\n\n        <h2>{{address.first_name}}\n\n          <ion-icon name="md-create" (click)="editAddress(address)" item-end></ion-icon>\n\n        </h2>\n\n        <p (click)="selectAddress(address)">{{address.phone}}\n\n          <br>{{address.address_1}}, {{address.address_2}}\n\n          <br>{{address.city}}</p>\n\n      </ion-label>\n\n    </ion-item>\n\n  </ion-list>\n\n  <div *ngIf="!addresses || !addresses.length" class="empty">\n\n    <div>\n\n      <img src="assets/imgs/empty.png">\n\n      <p>{{\'address_empty\' | translate}}!</p>\n\n    </div>\n\n  </div>\n\n  <div class="fixed-bottom">\n\n    <button ion-button full class="btn btn-green" (click)="addaddress()">{{\'my_address_add_new\' | translate}}</button>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/address/address.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_5__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
    ], AddressPage);
    return AddressPage;
}());

//# sourceMappingURL=address.js.map

/***/ }),

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OtpPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_firebase__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_register_request_models__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_auth_credential_models__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__tabs_tabs__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var OtpPage = /** @class */ (function () {
    function OtpPage(params, alertCtrl, loadingCtrl, toastCtrl, navCtrl, firebase, platform, service, events, translate) {
        this.params = params;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.firebase = firebase;
        this.platform = platform;
        this.service = service;
        this.events = events;
        this.translate = translate;
        this.loadingShown = false;
        this.captchanotvarified = true;
        this.buttonDisabled = true;
        this.otp = '';
        this.captchaVerified = false;
        this.minutes = 0;
        this.seconds = 0;
        this.totalSeconds = 0;
        this.intervalCalled = false;
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_7__models_register_request_models__["a" /* RegisterRequest */]('', '', '');
        this.subscriptions = [];
        this.resendCode = false;
        this.otpNotSent = true;
        console.log('UserId is  ', params.get('userId'));
        console.log('Dial Code code is  ', params.get('dialCode'));
        // this.platform.registerBackButtonAction(() => {
        //   this.makeExitAlert();
        //   //sometimes the best thing you can do is not think, not wonder, not imagine, not obsess. 
        //   //just breathe, and have faith that everything will work out for the best.
        // },1);
    }
    OtpPage.prototype.ionViewDidLoad = function () {
        this.dialCode = this.params.get('dialCode');
        this.registerRequest = JSON.parse(window.localStorage.getItem('userCreateData'));
        console.log("Previous data is:--", JSON.stringify(this.registerRequest));
        if (!(this.platform.is('cordova'))) {
            this.makeCaptcha();
        }
        console.log("Country code is ", this.dialCode);
        console.log("Phone no. is " + this.registerRequest.username);
        this.sendOTP();
    };
    OtpPage.prototype.sendOTP = function () {
        this.resendCode = false;
        this.otpNotSent = true;
        var phoneNumberString = "+" + this.dialCode + this.registerRequest.username;
        console.log("phone no. is " + this.registerRequest.username);
        if (this.platform.is('cordova')) {
            this.sendOtpPhone(phoneNumberString);
        }
        else {
            this.sendOtpBrowser(phoneNumberString);
        }
        if (this.intervalCalled) {
            clearInterval(this.timer);
        }
    };
    OtpPage.prototype.createTimer = function () {
        this.intervalCalled = true;
        this.totalSeconds--;
        if (this.totalSeconds == 0) {
            this.otpNotSent = true;
            this.resendCode = true;
            clearInterval(this.timer);
        }
        else {
            this.seconds = (this.totalSeconds % 60);
            if (this.totalSeconds >= this.seconds) {
                this.minutes = (this.totalSeconds - this.seconds) / 60;
            }
            else {
                this.minutes = 0;
            }
        }
    };
    OtpPage.prototype.createInterval = function () {
        var _this = this;
        this.totalSeconds = 120;
        this.createTimer();
        this.timer = setInterval(function () {
            _this.createTimer();
        }, 1000);
    };
    OtpPage.prototype.sendOtpPhone = function (phone) {
        var _this = this;
        this.translate.get('sending_otp').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading("Sending OTP by SMS");
        console.log("In cordova");
        this.firebase.verifyPhoneNumber(phone, 60)
            .then(function (credential) {
            console.log("credentials:-----");
            console.log(JSON.stringify(credential));
            _this.verfificationId = credential.verificationId;
            // this.showToast("OTP sent on your mobile");
            _this.translate.get('otp_sent').subscribe(function (value) {
                _this.showToast(value);
            });
            _this.otpNotSent = false;
            _this.dismissLoading();
            _this.createInterval();
        }).catch(function (error) {
            _this.otpNotSent = true;
            _this.resendCode = true;
            _this.dismissLoading();
            if (error.message) {
                _this.showToast(error.message);
            }
            else {
                _this.translate.get('otp_err').subscribe(function (value) {
                    _this.showToast(value);
                });
                // this.showToast("SMS not sent");
            }
        });
    };
    OtpPage.prototype.sendOtpBrowser = function (phone) {
        this.dismissLoading();
        var component = this;
        component.translate.get('sending_otp').subscribe(function (value) {
            component.presentLoading(value);
        });
        // component.presentLoading("Sending OTP by SMS");
        console.log("In not cordova");
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth().signInWithPhoneNumber(phone, this.recaptchaVerifier)
            .then(function (confirmationResult) {
            component.otpNotSent = false;
            component.result = confirmationResult;
            component.dismissLoading();
            component.translate.get('otp_sent').subscribe(function (value) {
                component.showToast(value);
            });
            // component.showToast("OTP sent on your mobile");
            if (component.intervalCalled) {
                clearInterval(component.timer);
            }
            component.createInterval();
        })
            .catch(function (error) {
            component.resendCode = true;
            component.dismissLoading();
            if (error.message) {
                component.showToast(error.message);
            }
            else {
                component.translate.get('otp_err').subscribe(function (value) {
                    component.presentLoading(value);
                });
                // component.showToast("SMS not sent");
            }
            console.log("SMS not sent " + JSON.stringify(error));
        });
    };
    OtpPage.prototype.verify = function () {
        this.otpNotSent = true;
        if (this.platform.is('cordova')) {
            this.verifyOtpPhone();
        }
        else {
            this.verifyOtpBrowser();
        }
    };
    OtpPage.prototype.verifyOtpPhone = function () {
        var _this = this;
        console.log("Verifying phone in cordova");
        var credential = __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth.PhoneAuthProvider.credential(this.verfificationId, this.otp);
        console.log("Fetched the credential");
        this.translate.get('verifying_otp').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading("Verifying OTP by SMS");
        __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth().signInAndRetrieveDataWithCredential(credential)
            .then(function (info) {
            console.log(JSON.stringify(info));
            _this.dismissLoading();
            _this.translate.get('otp_success').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast("OTP verified");
            _this.signIn();
        }, function (error) {
            if (error.message) {
                _this.showToast(error.message);
            }
            else {
                _this.translate.get('otp_err').subscribe(function (value) {
                    _this.showToast(value);
                });
                // this.showToast("Wrong OTP");
            }
            _this.dismissLoading();
            console.log(JSON.stringify(error));
        });
    };
    OtpPage.prototype.verifyOtpBrowser = function () {
        var component = this;
        console.log("Confimation result:---" + JSON.stringify(component.result));
        // component.presentLoading("Verifying OTP by SMS");
        component.translate.get('verifying_otp').subscribe(function (value) {
            component.presentLoading(value);
        });
        component.result.confirm(this.otp)
            .then(function (response) {
            component.dismissLoading();
            component.translate.get('otp_success').subscribe(function (value) {
                component.showToast(value);
            });
            // component.showToast("OTP verified");
            component.signIn();
        }).catch(function (error) {
            if (error.message) {
                component.showToast(error.message);
            }
            else {
                component.translate.get('otp_err').subscribe(function (value) {
                    component.showToast(value);
                });
                // component.showToast("Wrong OTP");
            }
            component.dismissLoading();
        });
    };
    OtpPage.prototype.makeCaptcha = function () {
        var component = this;
        this.recaptchaVerifier = new __WEBPACK_IMPORTED_MODULE_3_firebase___default.a.auth.RecaptchaVerifier('recaptcha-container', {
            // 'size': 'normal',
            'size': 'invisible',
            'callback': function (response) {
                component.captchanotvarified = true;
                console.log("captchanotvarified:--" + component.captchanotvarified);
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
        this.recaptchaVerifier.render();
    };
    OtpPage.prototype.signIn = function () {
        var _this = this;
        console.log("User id ", this.params.get("userId"));
        console.log("username is ", this.registerRequest.username);
        console.log("Password is ", this.registerRequest.password);
        // this.presentLoading("Please wait . . .");
        this.translate.get('wait').subscribe(function (value) {
            _this.presentLoading(value);
        });
        var credentials = new __WEBPACK_IMPORTED_MODULE_8__models_auth_credential_models__["a" /* AuthCredential */](this.registerRequest.username, this.registerRequest.password);
        var subscription = this.service.getAuthToken(credentials)
            .subscribe(function (data) {
            var authResponse = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
            _this.getUser(_this.params.get("userId"));
        }, function (err) {
            _this.dismissLoading();
            _this.translate.get('login_error').subscribe(function (value) {
                _this.presentErrorAlert(value);
            });
            // this.presentErrorAlert("Unable to login with provided credentials");
        });
        this.subscriptions.push(subscription);
    };
    OtpPage.prototype.getUser = function (userId) {
        var _this = this;
        var subscription = this.service.getUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), userId)
            .subscribe(function (data) {
            _this.dismissLoading();
            var userResponse = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(userResponse));
            window.localStorage.removeItem("userCreateData");
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_9__tabs_tabs__["a" /* TabsPage */]);
            _this.events.publish('user:login');
        }, function (err) {
            _this.dismissLoading();
            _this.translate.get('login_error').subscribe(function (value) {
                _this.presentErrorAlert(value);
            });
        });
        this.subscriptions.push(subscription);
    };
    OtpPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    OtpPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    OtpPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    OtpPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    OtpPage.prototype.makeExitAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Application exit prevented!');
                    }
                }, {
                    text: 'Close App',
                    handler: function () {
                        _this.platform.exitApp(); // Close this application
                    }
                }]
        });
        alert.present();
    };
    OtpPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
            selector: 'page-otp ',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/otp/otp.html"*/'<ion-header>\n\n  <ion-navbar>\n\n      <ion-title text-center>{{\'verification\' | translate}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <div class="form" padding-left padding-right>\n\n    <div id="recaptcha-container"></div>\n\n    <p text-center>{{\'otp_text\' | translate}} <br/>{{\'sent\' | translate }} +{{dialCode}} {{registerRequest.username}}</p>\n\n    <ion-list>\n\n      <ion-item>\n\n        <ion-label>{{\'otp\' | translate}}</ion-label>\n\n        <ion-input type="text" text-right placeholder="{{\'enter_otp\' | translate}}" [(ngModel)]="otp"></ion-input>\n\n      </ion-item>\n\n    </ion-list>\n\n    <button ion-button full class="bg-thime btn-round btn-text"  (click)="verify()" [disabled]="otpNotSent || otp==\'\'">\n\n      {{\'verify\' | translate}}       \n\n    </button>\n\n    <ion-item no-lines no-margin no-padding>\n\n      <button ion-button (click)="sendOTP()" clear  item-start (click)="sendOTP()" [disabled]="!resendCode"> {{\'resend\' | translate}} </button>\n\n      <ion-note item-end>\n\n        <ng-container *ngIf="minutes==0; else minuteTemplate">\n\n          00\n\n        </ng-container>\n\n        <ng-template #minuteTemplate>\n\n          {{minutes}}\n\n        </ng-template>:\n\n        <ng-container *ngIf="seconds==0; else secondTemplate">\n\n          00\n\n        </ng-container>\n\n        <ng-template #secondTemplate>\n\n          {{seconds}}\n\n        </ng-template> {{\'min_left\' | translate}}</ion-note>\n\n    </ion-item>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/otp/otp.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_4__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_0__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_0__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__["c" /* TranslateService */]])
    ], OtpPage);
    return OtpPage;
}());

//# sourceMappingURL=otp.js.map

/***/ }),

/***/ 137:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 137;

/***/ }),

/***/ 17:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WordpressClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__ = __webpack_require__(331);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap__ = __webpack_require__(332);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_app_config__ = __webpack_require__(41);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var WordpressClient = /** @class */ (function () {
    function WordpressClient(config, http) {
        this.config = config;
        this.http = http;
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }
    WordpressClient.prototype.convertToParams = function (data) {
        var p = [];
        for (var key in data) {
            p.push(key + '=' + encodeURIComponent(data[key]));
        }
        return p.join('&');
    };
    WordpressClient.prototype.checkToken = function (adminToken, idToken) {
        var data = this.convertToParams({ token: idToken });
        var httpOptions = {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({
                'Content-Type': 'application/json',
                // 'Content-Type':  'application/x-www-form-urlencoded',
                'Authorization': adminToken
            })
        };
        var token = this.http.post(this.config.apiBase + 'mobile-ecommerce/v1/jwt/token/firebase', { token: idToken }, httpOptions);
        return token.concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getCountries = function () {
        return this.http.get('./assets/json/countries.json')
            .concatMap(function (data) {
            var indiaObj = {};
            for (var index = 0; index < data.length; index++) {
                if (!(data[index].callingCodes.length) || data[index].callingCodes[0] == "") {
                    data.splice(index, 1);
                }
                if (data[index].alpha2Code === "IN") {
                    indiaObj = data[index];
                    data.splice(index, 1);
                }
            }
            data.splice(0, 0, indiaObj);
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.resetPassword = function (userName) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json' });
        return this.http
            .post(this.config.apiBase + 'mobile-ecommerce/v1/password/forgot', JSON.stringify({ user_login: userName }), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getUser = function (adminToken, userId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/customers/' + userId, { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.createUser = function (adminToken, credentials) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .post(this.config.apiBase + 'wp/v2/users', JSON.stringify(credentials), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.updateUser = function (adminToken, userId, userUpdateRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .put(this.config.apiBase + 'wc/v2/customers/' + userId, JSON.stringify(userUpdateRequest), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getAuthToken = function (credentials) {
        // const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
        // return this.http
        // 	.post<AuthResponse>(this.config.apiBase + 'jwt-auth/v1/token', JSON.stringify(credentials), { headers: myHeaders })
        // 	.concatMap(data => {
        // 		return Observable.of(data);
        // 	});
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json' });
        return this.http
            .post(this.config.apiBase + 'mobile-ecommerce/v1/jwt/token', JSON.stringify(credentials), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.createOrder = function (adminToken, createOrder) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .post(this.config.apiBase + 'wc/v2/orders/', JSON.stringify(createOrder), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getCouponByCode = function (adminToken, cCode) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/coupons?code=' + cCode, { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.applyCouponCode = function (adminToken, orderId, cCode) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'mobile-ecommerce/v1/coupon/order/' + orderId + '/apply-coupon?code=' + cCode, { headers: myHeaders })
            .concatMap(function (data) {
            var order = data;
            order.date_created = _this.formatDate(new Date(order.date_created));
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.myOrders = function (adminToken, customer_id, pageNo) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/orders/' + '?customer=' + customer_id + '&page=' + pageNo, { headers: myHeaders })
            .concatMap(function (data) {
            for (var i = 0; i < data.length; i++) {
                var order = data[i];
                order.date_created = _this.formatDate(new Date(order.date_created));
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.updateOrder = function (adminToken, orderId, orderUpdateRequest) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .put(this.config.apiBase + 'wc/v2/orders/' + orderId, JSON.stringify(orderUpdateRequest), { headers: myHeaders })
            .concatMap(function (data) {
            var order = data;
            order.date_created = _this.formatDate(new Date(order.date_created));
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.shippingLines = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/shipping_methods/', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.categories = function (adminToken, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/categories/?per_page=20&order=desc&orderby=count&page=' + pageNo + '&_embed', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productVariations = function (adminToken, productId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + productId + '/variations/', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsReviews = function (adminToken, productId) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + productId + '/reviews/', { headers: myHeaders })
            .concatMap(function (data) {
            for (var i = 0; i < data.length; i++) {
                var review = data[i];
                review.date_created = _this.formatDate(new Date(review.date_created));
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsAll = function (adminToken, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + '?per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productById = function (adminToken, proId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + proId, { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsByQuery = function (adminToken, query, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + '?search=' + query + '&per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsByCategory = function (adminToken, catId, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/products/' + '?category=' + catId + '&per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.banners = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'mobile-ecommerce/v1/banners/list', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.currencies = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/settings/general/woocommerce_currency', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.paymentGateways = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wc/v2/payment_gateways/', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.formatDate = function (date) {
        return this.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    };
    WordpressClient = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], WordpressClient);
    return WordpressClient;
}());

//# sourceMappingURL=wordpress-client.service.js.map

/***/ }),

/***/ 181:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 181;

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrdersdetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the OrdersdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var OrdersdetailPage = /** @class */ (function () {
    function OrdersdetailPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.orderProgress = 0;
        this.order = navParams.get('order');
        if (this.order.status.toLowerCase() == 'completed') {
            this.orderProgress = 3;
        }
        else if (this.order.status.toLowerCase() == 'processing') {
            this.orderProgress = 2;
        }
        else if (this.order.status.toLowerCase() == 'pending') {
            this.orderProgress = 1;
        }
    }
    OrdersdetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-ordersdetail',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/ordersdetail/ordersdetail.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{\'order\' | translate}} #{{order.id}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content class="bg-light">\n\n    <ion-row padding class="order_status">\n\n        <ion-col col-5>\n\n            <p>{{\'order_status\'}}</p>\n\n            <h4>{{order.status}}</h4>\n\n        </ion-col>\n\n        <ion-col col-7 text-center>\n\n            <span>\n\n                <ion-icon name="md-restaurant" [ngClass]="(orderProgress > 0) ? \'active\' : \'inactive\'"></ion-icon>\n\n            </span>\n\n            <span>\n\n                <ion-icon name="md-bicycle" [ngClass]="(orderProgress > 1) ? \'active\' : \'inactive\'"></ion-icon>\n\n            </span>\n\n            <span>\n\n                <ion-icon name="md-home" [ngClass]="(orderProgress > 2) ? \'active\' : \'inactive\'"></ion-icon>\n\n            </span>\n\n        </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n        <ion-col col-12>\n\n            <p padding style="margin-top: 6px; margin-bottom: 3px;">{{\'order_detail\' | translate}}\n\n                <span>{{order.date_created}}</span>\n\n            </p>\n\n        </ion-col>\n\n    </ion-row>\n\n    <ion-list no-lince>\n\n        <ion-item *ngFor="let item of order.line_items">\n\n            <ion-avatar item-start>\n\n                               <img src="assets/imgs/img_2.png">\n\n                <ion-icon name="md-images"></ion-icon>\n\n            </ion-avatar>\n\n            <h2>{{item.name}}</h2>\n\n            <p> </p>\n\n            <ion-row>\n\n                <ion-col col-6>\n\n                    <small>{{\'quantity\' | translate}} {{item.quantity}}</small>\n\n                </ion-col>\n\n                <ion-col col-6 text-right>\n\n                    <strong [innerHTML]="item.price_html"></strong>\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row>\n\n                \n\n                    <p>{{\'Share Your Location for Faster Delivery\' | translate}}</p>\n\n                </ion-row>   \n\n                <ion-row>\n\n                \n\n                <a ion-button full class="btn btn-green" href="https://api.whatsapp.com/send?phone=917012800595">\n\n                    {{\'Share to Whatsapp\' | translate}}</a>\n\n                \n\n            </ion-row>\n\n        </ion-item>\n\n    </ion-list>\n\n\n\n    <div class="fixed-bottom" padding-left padding-right>\n\n        <ion-row>\n\n            <ion-col col-5>\n\n                <small>{{\'Paid via\' | translate}}</small>\n\n                <br>\n\n                <p>{{order.payment_method_title}}</p>\n\n            </ion-col>\n\n            <ion-col col-7 text-right class="text-green">\n\n                <h3 [innerHTML]="order.total_html"></h3>\n\n            </ion-col>\n\n        </ion-row>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/ordersdetail/ordersdetail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], OrdersdetailPage);
    return OrdersdetailPage;
}());

//# sourceMappingURL=ordersdetail.js.map

/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderUpdateRequest; });
var OrderUpdateRequest = /** @class */ (function () {
    function OrderUpdateRequest(status) {
        this.status = status;
    }
    return OrderUpdateRequest;
}());

//# sourceMappingURL=order-update-request.models.js.map

/***/ }),

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MySplashPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__walkthough_walkthough__ = __webpack_require__(257);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MySplashPage = /** @class */ (function () {
    function MySplashPage(events, navCtrl) {
        var _this = this;
        this.events = events;
        this.navCtrl = navCtrl;
        var categories = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES));
        if (categories) {
            this.done();
        }
        else {
            events.subscribe('category:setup', function () {
                _this.done();
            });
        }
    }
    MySplashPage.prototype.done = function () {
        var wt = window.localStorage.getItem('wt');
        if (wt && wt == 'shown') {
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
        }
        else {
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__walkthough_walkthough__["a" /* WalkthoughPage */]);
        }
    };
    MySplashPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-mysplash',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/mysplash/mysplash.html"*/'<ion-content>\n    <img src="assets/imgs/splash.png">\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/mysplash/mysplash.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], MySplashPage);
    return MySplashPage;
}());

//# sourceMappingURL=mysplash.js.map

/***/ }),

/***/ 232:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__itemsinfo_itemsinfo__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__search_search__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_global__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__cart_cart__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__signin_signin__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_app_config__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};











var HomePage = /** @class */ (function () {
    function HomePage(config, platform, translateService, events, modalCtrl, toastCtrl, navCtrl, service, menu, global, loadingCtrl, alertCtrl) {
        var _this = this;
        this.config = config;
        this.platform = platform;
        this.translateService = translateService;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.menu = menu;
        this.global = global;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingShown = false;
        this.resetCartCountDone = false;
        this.subscriptions = [];
        this.categoriesAll = new Array();
        this.banners = new Array();
        this.selectedCategoryIdx = 0;
        this.products = new Array();
        // this.navCtrl.push(SigninPage);
        // this.presentErrorAlert("Hello");
        this.appTitle = config.appName;
        var categories = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES));
        var cats = new Array();
        for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
            var cat = categories_1[_i];
            if (Number(cat.parent) == 0 && Number(cat.count) > 0) {
                cats.push(cat);
            }
        }
        this.categoriesAll = cats;
        this.cartItems = global.getCartItems();
        this.products = JSON.parse(window.localStorage.getItem('productsAll'));
        if (!this.products) {
            this.products = new Array(this.categoriesAll.length);
        }
        //this.productsPage = JSON.parse(window.localStorage.getItem('pagesAll'));
        if (!this.productsPage) {
            this.productsPage = new Array();
            for (var i = 0; i < this.categoriesAll.length; i++) {
                this.productsPage.push(1);
            }
        }
        this.loadProducts(this.selectedCategoryIdx);
        this.loadBanners();
        this.checkstatus();
        events.publish('cart:count', this.cartItems.length);
        events.subscribe('go:to', function (to) {
            if (to == 'auth') {
                _this.translateService.get('no_sign_in').subscribe(function (value) {
                    _this.showToast(value);
                });
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__signin_signin__["a" /* SigninPage */]);
            }
        });
    }
    HomePage.prototype.loadBanners = function () {
        var _this = this;
        var savedBanners = JSON.parse(window.localStorage.getItem('banners'));
        if (savedBanners && savedBanners.length) {
            this.banners = savedBanners;
        }
        var subscription = this.service.banners(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            var banners = data;
            var categories = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES));
            for (var _i = 0, banners_1 = banners; _i < banners_1.length; _i++) {
                var ban = banners_1[_i];
                for (var _a = 0, categories_2 = categories; _a < categories_2.length; _a++) {
                    var cat = categories_2[_a];
                    if (cat.id == ban.category) {
                        ban.catObj = cat;
                        break;
                    }
                }
            }
            _this.banners = banners;
            window.localStorage.setItem('banners', JSON.stringify(_this.banners));
        }, function (err) {
        });
        this.subscriptions.push(subscription);
    };
    HomePage.prototype.ionViewWillLeave = function () {
        window.localStorage.setItem('productsAll', JSON.stringify(this.products));
        window.localStorage.setItem('pagesAll', JSON.stringify(this.productsPage));
    };
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
    HomePage.prototype.ngAfterViewInit = function () {
        this.slider.freeMode = true;
    };
    HomePage.prototype.ionViewDidEnter = function () {
        if (this.translateService.currentLang == 'ar') {
            this.slider._rtl = true;
        }
        var change = window.localStorage.getItem('changed');
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
    };
    HomePage.prototype.resetCartCount = function () {
        this.resetCartCountDone = true;
        if (this.products) {
            for (var _i = 0, _a = this.products; _i < _a.length; _i++) {
                var pros = _a[_i];
                if (pros) {
                    for (var _b = 0, pros_1 = pros; _b < pros_1.length; _b++) {
                        var pro = pros_1[_b];
                        pro.quantity = 0;
                        for (var _c = 0, _d = this.cartItems; _c < _d.length; _c++) {
                            var ci = _d[_c];
                            if (pro.id == ci.product_id) {
                                pro.quantity = ci.quantity;
                                break;
                            }
                        }
                    }
                }
            }
        }
    };
    HomePage.prototype.checkstatus = function () {
        var countDownHour = new Date("Jun 7, 2019 22:00:00").getHours();
        var countDownMin = new Date("Jun 7, 2019 22:00:00").getMinutes();
        var countDownSec = new Date("Jun 7, 2019 22:00:00").getSeconds();
        var cD = 0;
        if (countDownHour > 12) {
            cD = countDownHour - 12;
        }
        else {
            cD = countDownHour;
        }
        var countvalue = Math.floor((cD * 60 * 60) + (countDownMin * 60) + (countDownSec));
        // Update the count down every 1 second
        var x = setInterval(function () {
            // Get todays date and time
            var nowD = new Date().getHours();
            var nowM = new Date().getMinutes();
            var nowS = new Date().getSeconds();
            var nD = 0;
            if (nowD > 12) {
                nD = nowD - 12;
            }
            else {
                nD = nowD;
            }
            var nowvalue = Math.floor((nD * 60 * 60) + (nowM * 60) + (nowS));
            // Find the distance between now and the count down date
            // Output the result in an element with id="demo"
            // If the count down is over, write some text 
            console.log(nowD);
            console.log(nowvalue);
            console.log(countvalue);
            var distance = countvalue - nowvalue;
            // Time calculations for days, hours, minutes and seconds
            var hours = Math.floor((distance) / (60 * 60));
            var minutes = Math.floor((distance % (60 * 60)) / (60));
            var seconds = Math.floor((distance % (60 * 60)) % (60));
            console.log("distance", distance);
            if (nowD <= 10 || nowD >= 22) {
                document.getElementById("demo").innerHTML = "Order between 10am-10pm";
            }
            else {
                document.getElementById("demo").innerHTML = "Time left to order " + hours + "h "
                    + minutes + "m " + seconds + "s ";
            }
        }, 1000);
    };
    HomePage.prototype.loadProducts = function (catIndex) {
        var _this = this;
        if (!this.products[catIndex] || !this.products[catIndex].length) {
            this.presentLoading('loading ' + this.categoriesAll[catIndex].name + ' products');
        }
        this.productsPage[catIndex] = 1;
        var subscription = this.service.productsByCategory(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.categoriesAll[catIndex].id), String(this.productsPage[catIndex])).subscribe(function (data) {
            _this.dismissLoading();
            var response = data;
            var products = new Array();
            for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
                var pro = response_1[_i];
                if (pro.type == 'grouped' || pro.type == 'external' || !pro.purchasable)
                    continue;
                pro.quantity = 0;
                for (var _a = 0, _b = _this.cartItems; _a < _b.length; _a++) {
                    var ci = _b[_a];
                    if (pro.id == ci.product_id) {
                        pro.quantity = ci.quantity;
                        break;
                    }
                }
                console.log(pro);
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                products.push(pro);
            }
            _this.products[catIndex] = products;
        }, function (err) {
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    HomePage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.productsPage[this.selectedCategoryIdx]++;
        var page = this.productsPage[this.selectedCategoryIdx];
        var subscription = this.service.productsByCategory(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.categoriesAll[this.selectedCategoryIdx].id), String(page)).subscribe(function (data) {
            var response = data;
            if (!response || !response.length) {
                _this.productsPage[_this.selectedCategoryIdx]--;
            }
            for (var _i = 0, response_2 = response; _i < response_2.length; _i++) {
                var pro = response_2[_i];
                if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
                    continue;
                pro.quantity = 0;
                for (var _a = 0, _b = _this.cartItems; _a < _b.length; _a++) {
                    var ci = _b[_a];
                    if (pro.id == ci.product_id) {
                        pro.quantity = ci.quantity;
                        break;
                    }
                }
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                _this.products[_this.selectedCategoryIdx].push(pro);
            }
            infiniteScroll.complete();
        }, function (err) {
            _this.productsPage[_this.selectedCategoryIdx]--;
            infiniteScroll.complete();
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    HomePage.prototype.itemsinfo = function (pro) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__itemsinfo_itemsinfo__["a" /* ItemsinfoPage */], { pro: pro });
    };
    HomePage.prototype.goToSearch = function () {
        this.events.publish('tab:index', 1);
    };
    HomePage.prototype.decrementProduct = function (pro) {
        var decremented = this.global.decrementCartItem(pro);
        if (decremented) {
            pro.quantity = pro.quantity - 1;
            this.events.publish('cart:count', this.cartItems.length);
        }
    };
    HomePage.prototype.incrementProduct = function (pro) {
        var added = this.global.addCartItem(pro);
        pro.quantity = pro.quantity + 1;
        if (added) {
            this.events.publish('cart:count', this.cartItems.length);
        }
    };
    HomePage.prototype.addToCart = function (pro) {
        var _this = this;
        if (pro.in_stock && pro.purchasable) {
            var added = this.global.addCartItem(pro);
            var cartToast = added ? 'card_update1' : 'card_update2';
            this.translateService.get(cartToast).subscribe(function (value) {
                _this.showToast(value);
            });
            this.events.publish('cart:count', this.global.getCartItems().length);
        }
        else {
            this.translateService.get('item_empty').subscribe(function (value) {
                _this.showToast(value);
            });
        }
    };
    HomePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    HomePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    HomePage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translateService.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    HomePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    // wishlistPage() {
    //   this.navCtrl.push(WishlistPage);
    // }
    HomePage.prototype.searchPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__search_search__["a" /* SearchPage */]);
        modal.present();
    };
    HomePage.prototype.cartPage = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_7__cart_cart__["a" /* CartPage */]);
        modal.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
    ], HomePage.prototype, "slider", void 0);
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/home/home.html"*/'<ion-content>\n\n    <div class="logo">\n\n       \n\n    </div>\n\n    <div class="banner">\n\n      <ion-icon name="md-search" class="text-white" (click)="goToSearch()"></ion-icon>\n\n      <!-- <ion-slides autoplay="2000" loop="true" pager > -->\n\n      <ion-slides autoplay="3000" loop="true" pager >\n\n        <ion-slide> \n\n          <img src="http://greekdelivery.in/images/banner1.png" class="slide-image" />\n\n        </ion-slide>\n\n        <ion-slide>\n\n          <img src="http://greekdelivery.in/images/banner2.png" class="slide-image" />\n\n        </ion-slide>\n\n        <!-- <ion-slide>\n\n          <img src="http://greekdelivery.in/images/banner3.png" class="slide-image" />\n\n        </ion-slide> -->\n\n      </ion-slides>\n\n    </div>\n\n    <div class="tabs-list bg-green">\n\n      <ion-scroll scrollX="true" style="height: 50px;;">\n\n        <ion-segment class="bg-green" [(ngModel)]="selectedCategoryIdx">\n\n          <ion-segment-button *ngFor="let cat of categoriesAll; let i = index" [value]="i" [innerHTML]="cat.name" id="demo" (click)="loadProducts(i)">\n\n          </ion-segment-button>\n\n        </ion-segment>\n\n      </ion-scroll>\n\n    </div>\n\n    <div *ngIf="products[selectedCategoryIdx] && products[selectedCategoryIdx].length">\n\n        \n\n      <ion-grid>\n\n        <ion-row >\n\n              <ion-col >\n\n                <ion-card *ngFor="let pro of products[selectedCategoryIdx]">\n\n                    <ion-card-content  *ngIf="pro.in_stock==true" >\n\n                 \n\n                    <ion-thumbnail  item-start>\n\n                        <figure *ngIf="pro.images && pro.images.length" (click)="itemsinfo(pro)">\n\n                            <img data-src="{{pro.images[0].src}}">\n\n                        </figure>\n\n                        <figure *ngIf="!pro.images || !pro.images.length" (click)="itemsinfo(pro)">\n\n                            <img src="assets/imgs/img_1.png">\n\n                        </figure>\n\n                    </ion-thumbnail>\n\n                   \n\n                    <ion-row>\n\n                        <ion-col col-9 class="text-green">\n\n                          <h2></h2>\n\n                        <h2 style="font-size: 1.4rem;padding-left: 16px;padding-top: 12px;" (click)="itemsinfo(pro)">{{pro.name}} </h2>\n\n                        <p (click)="itemsinfo(pro)" [innerHTML]="pro.short_description"></p>\n\n                        </ion-col>\n\n                        <ion-col col-3 class="text-green">\n\n                            <!-- <p *ngIf="pro.type == \'simple\'" [innerHTML]="pro.regular_price_html"></p> -->\n\n                            <p *ngIf="pro.type == \'variable\'" [innerHTML]="pro.price_html"  ></p>\n\n                        </ion-col>\n\n                        <!-- <ion-icon name="md-remove-circle" (click)="decrementProduct(pro)"></ion-icon> -->\n\n                                <!-- <span>{{pro.quantity}}</span> -->\n\n                              \n\n                        <!-- <ion-col *ngIf="pro.type == \'simple\'" col-6>\n\n                            <h6>\n\n                                <ion-icon name="md-remove-circle" (click)="decrementProduct(pro)"></ion-icon>\n\n                                <span>{{pro.quantity}}</span>\n\n                                <ion-icon name="md-add-circle" class="active" (click)="incrementProduct(pro)"></ion-icon>\n\n                            </h6>\n\n                        </ion-col> -->\n\n                    </ion-row>\n\n                  </ion-card-content>\n\n                <ion-card-content *ngIf="pro.in_stock==false  && pro.stock_quantity != 0">\n\n                    <ion-thumbnail  item-start>\n\n                        <figure *ngIf="pro.images && pro.images.length" >\n\n                            <img data-src="{{pro.images[0].src}}">\n\n                        </figure>\n\n                        <figure *ngIf="!pro.images || !pro.images.length" >\n\n                            <img src="assets/imgs/img_1.png">\n\n                        </figure>\n\n                    </ion-thumbnail>\n\n                   \n\n                    <ion-row>\n\n                        <ion-col col-9 class="text-green">\n\n                          <h2></h2>\n\n                        <h2 style="font-size: 2rem;padding-left: 16px;padding-top: 12px;" >{{pro.name}} </h2>\n\n                        <p  [innerHTML]="pro.short_description"></p>\n\n                        </ion-col>\n\n                        <ion-col col-3 class="text-green">\n\n                            <!-- <p *ngIf="pro.type == \'simple\'" [innerHTML]="pro.regular_price_html"></p> -->\n\n                            <p *ngIf="pro.type == \'variable\'" style="color: red;\n\n                            font-weight: 500;\n\n                            text-align: right;\n\n                            padding-right: 12px;"   >Out of Stock</p>\n\n                        </ion-col>\n\n                        <!-- <ion-icon name="md-remove-circle" (click)="decrementProduct(pro)"></ion-icon> -->\n\n                                <!-- <span>{{pro.quantity}}</span> -->\n\n                              \n\n                        <!-- <ion-col *ngIf="pro.type == \'simple\'" col-6>\n\n                            <h6>\n\n                                <ion-icon name="md-remove-circle" (click)="decrementProduct(pro)"></ion-icon>\n\n                                <span>{{pro.quantity}}</span>\n\n                                <ion-icon name="md-add-circle" class="active" (click)="incrementProduct(pro)"></ion-icon>\n\n                            </h6>\n\n                        </ion-col> -->\n\n                    </ion-row>\n\n              </ion-card-content>\n\n                \n\n                </ion-card>\n\n                 \n\n                      \n\n\n\n              </ion-col>\n\n            </ion-row>\n\n       \n\n      </ion-grid>\n\n    \n\n        <!-- <ion-grid>\n\n            <ion-row>\n\n              <ion-col col-md-6>\n\n        <ion-card>\n\n            <ion-item *ngFor="let pro of products[selectedCategoryIdx]">\n\n                <ion-thumbnail item-start>\n\n                    <figure *ngIf="pro.images && pro.images.length" (click)="itemsinfo(pro)">\n\n                        <img data-src="{{pro.images[0].src}}">\n\n                    </figure>\n\n                    <figure *ngIf="!pro.images || !pro.images.length" (click)="itemsinfo(pro)">\n\n                        <img src="assets/imgs/img_1.png">\n\n                    </figure>\n\n                </ion-thumbnail>\n\n                <h2 (click)="itemsinfo(pro)">{{pro.name}}</h2>\n\n                <p (click)="itemsinfo(pro)" [innerHTML]="pro.short_description"></p>\n\n                <ion-row>\n\n                    <ion-col col-6 class="text-green">\n\n                        <p *ngIf="pro.type == \'simple\'" [innerHTML]="pro.sale_price_html"></p>\n\n                        <p *ngIf="pro.type == \'variable\'"  [innerHTML]="pro.price_html"></p>\n\n                    </ion-col>\n\n                    <ion-col *ngIf="pro.type == \'simple\'" col-6>\n\n                        <h6>\n\n                            <ion-icon name="md-remove-circle" (click)="decrementProduct(pro)"></ion-icon>\n\n                            <span>{{pro.quantity}}</span>\n\n                            <ion-icon name="md-add-circle" class="active" (click)="incrementProduct(pro)"></ion-icon>\n\n                        </h6>\n\n                    </ion-col>\n\n                </ion-row>\n\n            </ion-item>\n\n        </ion-card>\n\n        </ion-col>\n\n        <ion-col col-md-6>\n\n            <ion-card>\n\n                <ion-item *ngFor="let pro of products[selectedCategoryIdx]">\n\n                    <ion-thumbnail item-start>\n\n                        <figure *ngIf="pro.images && pro.images.length" (click)="itemsinfo(pro)">\n\n                            <img data-src="{{pro.images[0].src}}">\n\n                        </figure>\n\n                        <figure *ngIf="!pro.images || !pro.images.length" (click)="itemsinfo(pro)">\n\n                            <img src="assets/imgs/img_1.png">\n\n                        </figure>\n\n                    </ion-thumbnail>\n\n                    <h2 (click)="itemsinfo(pro)">{{pro.name}}</h2>\n\n                    <p (click)="itemsinfo(pro)" [innerHTML]="pro.short_description"></p>\n\n                    <ion-row>\n\n                        <ion-col col-6 class="text-green">\n\n                            <p *ngIf="pro.type == \'simple\'" [innerHTML]="pro.sale_price_html"></p>\n\n                            <p *ngIf="pro.type == \'variable\'"  [innerHTML]="pro.price_html"></p>\n\n                        </ion-col>\n\n                        <ion-col *ngIf="pro.type == \'simple\'" col-6>\n\n                            <h6>\n\n                                <ion-icon name="md-remove-circle" (click)="decrementProduct(pro)"></ion-icon>\n\n                                <span>{{pro.quantity}}</span>\n\n                                <ion-icon name="md-add-circle" class="active" (click)="incrementProduct(pro)"></ion-icon>\n\n                            </h6>\n\n                        </ion-col>\n\n                    </ion-row>\n\n                </ion-item>\n\n            </ion-card>\n\n            </ion-col>\n\n            </ion-row>\n\n            </ion-grid> -->\n\n        <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n\n            <ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n        </ion-infinite-scroll>\n\n    </div>\n\n\n\n    <div *ngIf="!loadingShown && (!products[selectedCategoryIdx] || !products[selectedCategoryIdx].length)" class="empty">\n\n        <div>\n\n            <img src="assets/imgs/empty.png">\n\n            <p>{{ "skip" | translate }}!</p>\n\n        </div>\n\n    </div>\n\n\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/home/home.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_5__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_4__providers_global__["a" /* Global */]],
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* ViewEncapsulation */].None
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Inject */])(__WEBPACK_IMPORTED_MODULE_9__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_10__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_5__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* MenuController */], __WEBPACK_IMPORTED_MODULE_4__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConaddressPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__conpayment_conpayment__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__address_address__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ConaddressPage = /** @class */ (function () {
    function ConaddressPage(translate, navCtrl, navParams, global, toastCtrl) {
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.global = global;
        this.toastCtrl = toastCtrl;
        this.editMainCart = false;
        this.deliveryPayble = '0';
        this.currencyIcon = '';
        this.currencyText = '';
        this.totalItems = 0;
        this.total = 0;
        this.totalToShow = "0";
        this.cartItems = this.navParams.get('cart');
        this.totalItems = this.navParams.get('totalItems');
        this.total = this.navParams.get('total');
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
        }
        this.deliveryPayble = this.currencyIcon + ' ' + this.deliveryPayble;
        var coupon = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_COUPON));
        if (coupon) {
            this.totalToShow = this.currencyIcon + ' ' + this.total;
        }
        else {
            this.totalToShow = this.currencyIcon + ' ' + this.totalItems;
        }
    }
    ConaddressPage.prototype.ionViewDidEnter = function () {
        this.selectedAddress = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS));
    };
    ConaddressPage.prototype.newAddress = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__address_address__["a" /* AddressPage */], { choose: true });
    };
    ConaddressPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    ConaddressPage.prototype.paymentPage = function () {
        var _this = this;
        if (this.selectedAddress == null) {
            this.translate.get('select_address').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Please select an address.');
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__conpayment_conpayment__["a" /* ConpaymentPage */], { cart: this.cartItems, totalItems: this.totalItems, total: this.total });
        }
    };
    ConaddressPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-conaddress',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/conaddress/conaddress.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{\'confirm_order\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n    <ion-row text-center class="bg-green">\n\n        <ion-col col-12>\n\n            {{\'address\' | translate}}\n\n        </ion-col>\n\n    </ion-row>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <ion-list radio-group no-lines>\n\n        <h5 padding>{{\'Select Delivery Address\' | translate}}\n\n            <span class="buttongreen" (click)="newAddress()">{{\'Add New\' | translate}}</span>\n\n        </h5>\n\n        <ion-item *ngIf="selectedAddress">\n\n            <!-- <ion-radio checked="address.id==selectedAddress.id" item-start></ion-radio> -->\n\n            <ion-label>\n\n                <h2>{{selectedAddress.first_name}}</h2>\n\n                <p>{{selectedAddress.phone}}\n\n                    <br>{{selectedAddress.address_1}}, {{selectedAddress.address_2}}\n\n                    <br>{{selectedAddress.city}} </p>\n\n            </ion-label>\n\n        </ion-item>\n\n        <ion-card-content *ngIf="!selectedAddress">\n\n            <div class="addres-detail">\n\n                <h3>{{\'No address selected\' | translate}}</h3>\n\n                <p>{{\'Add an address to continue.\' | translate}}</p>\n\n            </div>\n\n        </ion-card-content>\n\n        <hr>\n\n    </ion-list>\n\n\n\n    <div class="fixed-bottom">\n\n        <p>\n\n            {{cartItems.length}} {{\'item\' | translate}}{{\'(s)\' | translate}}\n\n            <strong [innerHTML]="totalToShow"></strong>\n\n        </p>\n\n        <p class="btn" (click)="paymentPage()">{{\'Proceed to Payment\' | translate}}</p>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/conaddress/conaddress.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
    ], ConaddressPage);
    return ConaddressPage;
}());

//# sourceMappingURL=conaddress.js.map

/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConpaymentPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__confirmed_confirmed__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_order_request_models__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_in_app_browser__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_paypal__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_app_config__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__tabs_tabs__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__models_order_update_request_models__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};












var ConpaymentPage = /** @class */ (function () {
    function ConpaymentPage(config, translateService, events, iab, payPal, toastCtrl, navCtrl, navParams, service, loadingCtrl, alertCtrl) {
        this.config = config;
        this.translateService = translateService;
        this.events = events;
        this.iab = iab;
        this.payPal = payPal;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingShown = false;
        this.placedPagePushed = false;
        this.paymentDone = false;
        this.paymentFailAlerted = false;
        this.subscriptions = [];
        this.paymentGateways = new Array();
        this.totalItems = 0;
        this.total = 0;
        this.couponApplied = false;
        this.deliveryPayble = '0';
        this.currencyIcon = '';
        this.currencyText = '';
        this.totalToShow = '';
        this.cartItems = this.navParams.get('cart');
        this.totalItems = this.navParams.get('totalItems');
        this.total = this.navParams.get('total');
        var paymentGateways = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].PAYMENT_GATEWAYS));
        this.selectedAddress = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS));
        if (paymentGateways != null) {
            for (var _i = 0, paymentGateways_1 = paymentGateways; _i < paymentGateways_1.length; _i++) {
                var pg = paymentGateways_1[_i];
                if (pg.enabled && this.paymentImplemented(pg.id)) {
                    this.paymentGateways.push(pg);
                }
            }
        }
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
        }
        this.coupon = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].SELECTED_COUPON));
        if (this.coupon) {
            this.totalToShow = this.currencyIcon + ' ' + this.total;
        }
        else {
            this.totalToShow = this.currencyIcon + ' ' + this.totalItems;
        }
    }
    ConpaymentPage.prototype.paymentImplemented = function (id) {
        return id === "paypal" || id === "ppec_paypal" || id === "pumcp" || id === "payuindia" || id === "cod";
    };
    ConpaymentPage.prototype.paymentMethod = function (paymentGateway) {
        this.selectedPaymentGateway = paymentGateway;
    };
    ConpaymentPage.prototype.placedPage = function () {
        var _this = this;
        if (this.selectedPaymentGateway == null) {
            this.translateService.get('select_method').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Choose payment method.');
        }
        else {
            this.orderRequest = new __WEBPACK_IMPORTED_MODULE_4__models_order_request_models__["a" /* OrderRequest */]();
            this.orderRequest.payment_method = this.selectedPaymentGateway.id;
            this.orderRequest.payment_method_title = this.selectedPaymentGateway.title;
            this.orderRequest.set_paid = false;
            this.orderRequest.billing = this.selectedAddress;
            this.orderRequest.shipping = this.selectedAddress;
            this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].USER_KEY));
            this.orderRequest.customer_id = String(this.user.id);
            this.orderRequest.line_items = this.cartItems;
            for (var _i = 0, _a = this.orderRequest.line_items; _i < _a.length; _i++) {
                var item = _a[_i];
                item.product = null;
            }
            this.translateService.get('Creating order').subscribe(function (value) {
                _this.presentLoading(value);
            });
            var subscription = this.service.createOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.orderRequest).subscribe(function (data) {
                _this.orderResponse = data;
                if (_this.coupon) {
                    var couponSubs = _this.service.applyCouponCode(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(_this.orderResponse.id), _this.coupon.code).subscribe(function (data) {
                        _this.couponApplied = true;
                        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
                        // this.showToast('Coupon applied');
                        _this.translateService.get('Coupon applied').subscribe(function (value) {
                            _this.showToast(value);
                        });
                        _this.orderPlaced();
                    }, function (err) {
                        console.log(err);
                        _this.dismissLoading();
                    });
                    _this.subscriptions.push(couponSubs);
                }
                else {
                    _this.orderPlaced();
                }
            }, function (err) {
                _this.dismissLoading();
            });
            this.subscriptions.push(subscription);
        }
    };
    ConpaymentPage.prototype.orderPlaced = function () {
        var _this = this;
        this.dismissLoading();
        if (this.selectedPaymentGateway.id === "paypal") {
            this.initPayPal();
        }
        else if (this.selectedPaymentGateway.id === "ppec_paypal") {
            this.initPayPal();
        }
        else if (this.selectedPaymentGateway.id === "pumcp" || this.selectedPaymentGateway.id === "payuindia") {
            this.initPayUMoney();
        }
        else if (this.selectedPaymentGateway.id === "cod") {
            this.clearCart();
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__confirmed_confirmed__["a" /* ConfirmedPage */]);
        }
        else {
            this.translateService.get('processed_cod').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Processed via Cash on delivery');
            this.clearCart();
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__confirmed_confirmed__["a" /* ConfirmedPage */]);
        }
    };
    // Example sandbox response
    //
    // {
    //   "client": {
    //     "environment": "sandbox",
    //     "product_name": "PayPal iOS SDK",
    //     "paypal_sdk_version": "2.16.0",
    //     "platform": "iOS"
    //   },
    //   "response_type": "payment",
    //   "response": {
    //     "id": "PAY-1AB23456CD789012EF34GHIJ",
    //     "state": "approved",
    //     "create_time": "2016-10-03T13:33:33Z",
    //     "intent": "sale"
    //   }
    // }
    ConpaymentPage.prototype.initPayPal = function () {
        var _this = this;
        this.payPal.init({ PayPalEnvironmentProduction: this.config.paypalProduction, PayPalEnvironmentSandbox: this.config.paypalSandbox }).then(function () {
            // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
            _this.payPal.prepareToRender(_this.config.paypalProduction ? 'PayPalEnvironmentProduction' : 'PayPalEnvironmentSandbox', new __WEBPACK_IMPORTED_MODULE_7__ionic_native_paypal__["b" /* PayPalConfiguration */]({})).then(function () {
                var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].CURRENCY));
                var payment = new __WEBPACK_IMPORTED_MODULE_7__ionic_native_paypal__["c" /* PayPalPayment */](String(_this.couponApplied ? _this.total : _this.totalItems), currency.value, 'Description', 'sale');
                _this.payPal.renderSinglePaymentUI(payment).then(function () {
                    _this.paymentSuccess();
                    // Successfully paid
                }, function () {
                    _this.paymentFailure();
                    // Error or render dialog closed without being successful
                });
            }, function () {
                // Error in configuration
            });
        }, function () {
            // Error in initialization, maybe PayPal isn't supported or something else
        });
    };
    ConpaymentPage.prototype.initPayUMoney = function () {
        var _this = this;
        var name = this.user.username;
        var mobile = '9873194659';
        var email = this.user.email;
        var bookingId = String(Math.floor(Math.random() * (99 - 10 + 1) + 10)) + String(this.orderResponse.id);
        var productinfo = this.orderResponse.order_key;
        var salt = this.config.payuSalt;
        var key = this.config.payuKey;
        var amt = this.couponApplied ? this.total : this.totalItems;
        var string = key + '|' + bookingId + '|' + amt + '|' + productinfo + '|' + name + '|' + email + '|||||||||||' + salt;
        // let encrypttext = sha512(string);
        var url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&salt=" + salt + "&key=" + key;
        // let url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&hash=" + encrypttext + "&salt=" + salt + "&key=" + key;
        var options = {
            location: 'yes',
            clearcache: 'yes',
            zoom: 'yes',
            toolbar: 'no',
            closebuttoncaption: 'back'
        };
        var browser = this.iab.create(url, '_blank', options);
        browser.on('loadstop').subscribe(function (event) {
            browser.executeScript({
                file: "payumoney/payumoneyPaymentGateway.js"
            });
            if (event.url == "http://localhost/success.php") {
                _this.paymentSuccess();
                browser.close();
            }
            if (event.url == "http://localhost/failure.php") {
                _this.paymentFailure();
                browser.close();
            }
        });
        browser.on('exit').subscribe(function (event) {
            if (!_this.paymentDone && !_this.paymentFailAlerted) {
                _this.paymentFailure();
            }
        });
        browser.on('loaderror').subscribe(function (event) {
            _this.translateService.get('Something went wrong').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Something went wrong');
        });
    };
    ConpaymentPage.prototype.paymentFailure = function () {
        var _this = this;
        this.paymentFailAlerted = true;
        var subscription = this.service.updateOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.orderResponse.id), new __WEBPACK_IMPORTED_MODULE_10__models_order_update_request_models__["a" /* OrderUpdateRequest */]('cancelled')).subscribe(function (data) {
        }, function (err) {
            console.log(err);
        });
        this.subscriptions.push(subscription);
        var alert = this.alertCtrl.create({
            title: "{{'Payment failure' | translate}}",
            message: "{{'pymt_fail_msg' | translate}}",
            buttons: [{
                    text: "{{'okay' | translate}}",
                    role: 'cancel',
                    handler: function () {
                        _this.done();
                        console.log('Okay clicked');
                    }
                }]
        });
        alert.present();
    };
    ConpaymentPage.prototype.paymentSuccess = function () {
        var _this = this;
        this.paymentDone = true;
        this.clearCart();
        this.translateService.get('Just a moment').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('Just a moment');
        var subscription = this.service.updateOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.orderResponse.id), { set_paid: true }).subscribe(function (data) {
            _this.done();
        }, function (err) {
            _this.done();
            _this.paymentSuccess();
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    ConpaymentPage.prototype.done = function () {
        if (!this.placedPagePushed) {
            this.placedPagePushed = true;
            this.dismissLoading();
            this.navCtrl.setRoot(this.paymentFailAlerted ? __WEBPACK_IMPORTED_MODULE_9__tabs_tabs__["a" /* TabsPage */] : __WEBPACK_IMPORTED_MODULE_2__confirmed_confirmed__["a" /* ConfirmedPage */]);
        }
    };
    ConpaymentPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    ConpaymentPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    ConpaymentPage.prototype.presentErrorAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: "{{'error' | translate}}",
            subTitle: msg,
            buttons: ["{{'dismiss' | translate}}"]
        });
        alert.present();
    };
    ConpaymentPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    ConpaymentPage.prototype.clearCart = function () {
        var cartItems = new Array();
        window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
        this.events.publish('cart:count', cartItems.length);
    };
    ConpaymentPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-conpayment',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/conpayment/conpayment.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{"confirm_order" | translate}}</ion-title>\n\n    </ion-navbar>\n\n    <ion-row text-center class="bg-green">\n\n        \n\n        <ion-col col-12>\n\n            {{\'payment\' | translate}}\n\n        </ion-col>\n\n    </ion-row>\n\n</ion-header>\n\n\n\n\n\n<ion-content class="bg-light">\n\n    <ion-list radio-group no-lines>\n\n        <h5 padding>{{\'select_method\' | translate}}</h5>\n\n        <ion-item *ngFor="let item of paymentGateways">\n\n            <ion-radio value="{{item.title}}" (click)="paymentMethod(item)"></ion-radio>\n\n            <ion-label>\n\n                <h2>{{item.title}}</h2>\n\n            </ion-label>\n\n            <ion-avatar item-end>\n\n                <img *ngIf="item.id.indexOf(\'pum\')!=-1" src="assets/imgs/payment_payu.png">\n\n                <img *ngIf="item.id.indexOf(\'paypal\')!=-1" src="assets/imgs/payment_paypal.png">\n\n                <img *ngIf="item.id.indexOf(\'cod\')!=-1" src="assets/imgs/payment_cod.png">\n\n                <img *ngIf="item.id.indexOf(\'cod\')==-1 && item.id.indexOf(\'pum\')==-1 && item.id.indexOf(\'paypal\')==-1" src="assets/imgs/payment_cards.png">\n\n            </ion-avatar>\n\n        </ion-item>\n\n\n\n    </ion-list>\n\n    <div class="fixed-bottom">\n\n        <p>\n\n            {{cartItems.length}} {{\'item\' | translate}}{{\'select_method\' | translate}}\n\n            <strong [innerHTML]="totalToShow"></strong>\n\n        </p>\n\n        <p class="btn" (click)="placedPage()">{{\'Place Order\' | translate}}</p>\n\n    </div>\n\n\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/conpayment/conpayment.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Inject */])(__WEBPACK_IMPORTED_MODULE_8__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_11__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_in_app_browser__["a" /* InAppBrowser */], __WEBPACK_IMPORTED_MODULE_7__ionic_native_paypal__["a" /* PayPal */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], ConpaymentPage);
    return ConpaymentPage;
}());

//# sourceMappingURL=conpayment.js.map

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfirmedPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cart_cart__ = __webpack_require__(64);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ConfirmedPage = /** @class */ (function () {
    function ConfirmedPage(events, navCtrl, navParams) {
        this.events = events;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].USER_KEY));
    }
    ConfirmedPage.prototype.proceed = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__cart_cart__["a" /* CartPage */]);
    };
    ConfirmedPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-confirmed',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/confirmed/confirmed.html"*/'<ion-header class="bg-transparent">\n\n    <ion-navbar>\n\n        <ion-title></ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n\n\n<ion-content text-center>\n\n    <figure>\n\n        <img src="assets/imgs/fishing.gif">\n\n    </figure>\n\n    <h2>{{\'order_confirmed\' | translate}}!</h2>\n\n    <div  class="fixed-bottom" >\n\n        <h2>{{\'Share Your Location for Faster Delivery\'}}</h2>\n\n        <button ion-button full class="btn" (click)="proceed()">\n\n        <a  style="text-decoration: none;color:white;"  href="https://api.whatsapp.com/send?phone=917012800595"> <ion-icon class="icon" ios="ios-pin" md="md-pin"></ion-icon> \n\n        {{\'Share your location to Whatsapp\'}}</a></button>\n\n    </div>\n\n    \n\n</ion-content>\n\n'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/confirmed/confirmed.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], ConfirmedPage);
    return ConfirmedPage;
}());

//# sourceMappingURL=confirmed.js.map

/***/ }),

/***/ 238:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddaddressPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_address_models__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the AddaddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AddaddressPage = /** @class */ (function () {
    function AddaddressPage(navCtrl, translate, navParams, toastCtrl) {
        this.navCtrl = navCtrl;
        this.translate = translate;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.address = new __WEBPACK_IMPORTED_MODULE_2__models_address_models__["a" /* Address */]();
        var address = this.navParams.get('address');
        if (address != null) {
            this.address = address;
        }
        else {
            this.address.id = -1;
            var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].USER_KEY));
            if (user != null) {
                this.address.first_name = user.first_name;
                this.address.last_name = user.last_name;
                this.address.email = user.email;
            }
        }
        this.addresses = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST));
    }
    AddaddressPage.prototype.saveAddress = function () {
        var _this = this;
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!this.address.first_name || !this.address.first_name.length) {
            this.translate.get('field_error_name_first').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter first name');
        }
        else if (!this.address.last_name || !this.address.last_name.length) {
            this.translate.get('field_error_name_last').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter last name');
        }
        else if (!this.address.email || this.address.email.length <= 5 || !reg.test(this.address.email)) {
            this.translate.get('field_error_email').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter valid email address');
        }
        else if (!this.address.phone || !this.address.phone.length) {
            this.translate.get('field_error_phone').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter phone number');
        }
        else if (!this.address.address_1 || !this.address.address_1.length) {
            this.translate.get('field_error_address_line1').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter address line one');
        }
        else if (!this.address.address_2 || !this.address.address_2.length) {
            this.translate.get('field_error_address_line2').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter address line 2');
        }
        else if (!this.address.city || !this.address.city.length) {
            this.translate.get('field_error_city').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter city');
        }
        else if (!this.address.state || !this.address.state.length) {
            this.translate.get('field_error_state').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter state');
        }
        else if (!this.address.postcode || !this.address.postcode.length) {
            this.translate.get('field_error_postalcode').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter postcode');
        }
        else if (!this.address.country || !this.address.country.length) {
            this.translate.get('field_error_country').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter country');
        }
        else {
            if (this.address.id == -1) {
                if (!this.addresses) {
                    this.addresses = new Array();
                }
                this.address.id = this.addresses.length + 1;
                this.addresses.push(this.address);
            }
            else {
                var index = -1;
                for (var i = 0; i < this.addresses.length; i++) {
                    if (this.address.id == this.addresses[i].id) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    this.addresses[index] = this.address;
                }
            }
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST, JSON.stringify(this.addresses));
            this.navCtrl.pop();
        }
    };
    AddaddressPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    AddaddressPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-addaddress',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/addaddress/addaddress.html"*/'<ion-header>\n\n\n\n    <ion-navbar>\n\n        <ion-title>{{ \'my_address_add_new\' | translate }}</ion-title>\n\n    </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content class="bg-light">\n\n    <ion-list class="default-form">\n\n        <ion-item>\n\n            <ion-label floating>{{ \'address_first_name\' | translate }}</ion-label>\n\n            <ion-input type="text" text-right placeholder="{{ \'address_first_name\' | translate }}" [(ngModel)]="address.first_name"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n            <ion-label floating>{{ \'address_last_name\' | translate }}</ion-label>\n\n            <ion-input type="text" text-right placeholder="{{ \'address_last_name\' | translate }}" [(ngModel)]="address.last_name"></ion-input>\n\n        </ion-item>\n\n    </ion-list>\n\n    <ion-list class="default-form">\n\n        <ion-item>\n\n            <ion-label floating>{{ \'email\' | translate }}</ion-label>\n\n            <ion-input type="email" text-right placeholder="{{ \'email\' | translate }}" [(ngModel)]="address.email"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n            <ion-label floating>{{ \'phone\' | translate }}</ion-label>\n\n            <ion-input type="tel" text-right placeholder="{{ \'phone\' | translate }}" [(ngModel)]="address.phone"></ion-input>\n\n        </ion-item>\n\n    </ion-list>\n\n    <ion-list>\n\n        <ion-item>\n\n            <ion-label floating>{{ \'address_address_1\' | translate }}</ion-label>\n\n            <ion-input type="text" text-right placeholder="{{ \'address_address_1\' | translate }}" [(ngModel)]="address.address_1"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n            <ion-label floating>{{ \'address_address_2\' | translate }}</ion-label>\n\n            <ion-input type="text" text-right placeholder="{{ \'address_address_1\' | translate }}" [(ngModel)]="address.address_2"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n            <ion-label floating>{{ \'city\' | translate }}</ion-label>\n\n            <ion-input type="text" text-right placeholder="{{ \'city\' | translate }}" [(ngModel)]="address.city"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n            <ion-label floating>{{ \'state\' | translate }}</ion-label>\n\n            <ion-input type="text" text-right placeholder="{{ \'state\' | translate }}" [(ngModel)]="address.state"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n            <ion-label floating>{{ \'country\' | translate }}</ion-label>\n\n            <ion-input type="text" text-right placeholder="{{ \'country\' | translate }}" [(ngModel)]="address.country"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n            <ion-label floating>{{ \'postal_code\' | translate }}</ion-label>\n\n            <ion-input type="number" text-right placeholder="{{ \'postal_code\' | translate }}" [(ngModel)]="address.postcode"></ion-input>\n\n        </ion-item>\n\n    </ion-list>\n\n    <!--    <p padding text-center class="fixed-bottom">Add New Address</p>-->\n\n    <div class="fixed-bottom">\n\n        <button ion-button full class="btn btn-green" (click)="saveAddress()">\n\n        {{ \'Save Address\' | translate }}</button>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/addaddress/addaddress.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
    ], AddaddressPage);
    return AddaddressPage;
}());

//# sourceMappingURL=addaddress.js.map

/***/ }),

/***/ 239:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CodePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CodePage = /** @class */ (function () {
    function CodePage(translate, service, loadingCtrl, toastCtrl, navParams, viewCtrl) {
        this.translate = translate;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.cCode = "";
        this.loadingShown = false;
        this.subscriptions = [];
    }
    CodePage.prototype.checkCode = function () {
        var _this = this;
        if (!this.cCode.length) {
            this.translate.get('valid_promo').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter valid coupon code.');
        }
        else {
            this.translate.get('Just a moment').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('just a moment');
            var subscription = this.service.getCouponByCode(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.cCode).subscribe(function (data) {
                _this.dismissLoading();
                var coupons = data;
                if (!coupons.length) {
                    _this.translate.get('invalid_coupon').subscribe(function (value) {
                        _this.presentLoading(value);
                    });
                    // this.showToast('Invalid coupon code');
                }
                else {
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_COUPON, JSON.stringify(coupons[0]));
                    _this.dismiss();
                }
            }, function (err) {
                _this.dismissLoading();
                _this.translate.get('invalid_coupon').subscribe(function (value) {
                    _this.presentLoading(value);
                });
                // this.showToast('Invalid coupon code');
            });
            this.subscriptions.push(subscription);
        }
    };
    CodePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    CodePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    CodePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    CodePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    CodePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-code ',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/code/code.html"*/'<ion-content class="bg-light">\n\n    <div class="code">\n\n        <h2>{{\'Add Promo code\' | translate}}</h2>\n\n        <ion-input type="text" value="" [(ngModel)]="cCode" placeholder="Enter promo code here"></ion-input>\n\n        <button ion-button full class="btn-round btn-text btn btn-green" (click)="checkCode()">{{\'submit\' | translate}}</button>\n\n    </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/code/code.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
    ], CodePage);
    return CodePage;
}());

//# sourceMappingURL=code.js.map

/***/ }),

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SigninPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__password_password__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__signup_signup__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__phone_phone__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tabs_tabs__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_auth_credential_models__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_register_request_models__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__node_modules_ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_app_config__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_firebase__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_facebook__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_google_plus__ = __webpack_require__(247);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};















var SigninPage = /** @class */ (function () {
    function SigninPage(config, facebook, translate, events, modalCtrl, alertCtrl, toastCtrl, navCtrl, service, loadingCtrl, google, platform) {
        this.config = config;
        this.facebook = facebook;
        this.translate = translate;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.google = google;
        this.platform = platform;
        this.loadingShown = false;
        this.authError = "";
        this.subscriptions = [];
        this.credentials = new __WEBPACK_IMPORTED_MODULE_7__models_auth_credential_models__["a" /* AuthCredential */]('', '');
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_8__models_register_request_models__["a" /* RegisterRequest */]('', '', '');
        this.buttonDisabled = true;
        this.token = window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].ADMIN_API_KEY);
        /*if (this.userLoggedIn()) {
          navCtrl.setRoot(TabsPage);
        }*/
    }
    SigninPage.prototype.userLoggedIn = function () {
        var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].USER_KEY));
        return user != null;
    };
    SigninPage.prototype.loginFB = function () {
        var _this = this;
        this.translate.get('loging_fb').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('Logging in Facebook');
        if (this.platform.is('cordova')) {
            this.fbOnPhone();
        }
        else {
            this.fbOnBrowser();
        }
    };
    SigninPage.prototype.loginGoogle = function () {
        var _this = this;
        this.translate.get('loging_google').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading('Logging in Google+');
        if (this.platform.is('cordova')) {
            this.googleOnPhone();
        }
        else {
            this.googleOnBrowser();
        }
    };
    SigninPage.prototype.googleOnPhone = function () {
        var _this = this;
        var provider = {
            'webClientId': this.config.firebaseConfig.webApplicationId,
            'offline': false,
            'scopes': 'profile email'
        };
        console.log("In cordova");
        console.log("Calling google in cordova");
        this.google.login(provider)
            .then(function (res) {
            _this.dismissLoading();
            _this.translate.get('google_success_auth1').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Google signup success, authenticating with firebase');
            var googleCredential = __WEBPACK_IMPORTED_MODULE_12_firebase___default.a.auth.GoogleAuthProvider
                .credential(res.idToken);
            __WEBPACK_IMPORTED_MODULE_12_firebase___default.a.auth().signInWithCredential(googleCredential)
                .then(function (response) {
                _this.registerRequest.email = response.email;
                _this.registerRequest.first_name = _this.getNames(response.displayName).first_name;
                _this.registerRequest.last_name = _this.getNames(response.displayName).last_name;
                _this.dismissLoading();
                _this.translate.get('google_success_auth2').subscribe(function (value) {
                    _this.presentLoading(value);
                });
                // this.presentLoading('Firebase authenticated google signup, creating user..');
                _this.checkUser();
            });
        }, function (err) {
            console.error("Error: ", err);
            _this.dismissLoading();
        });
    };
    SigninPage.prototype.getNames = function (displayName) {
        var obj = { first_name: '', last_name: '' };
        if (!displayName.length || displayName == "") {
            return obj;
        }
        var names = displayName.split(" ");
        obj.first_name = names[0];
        for (var i = 0; i < names.length; i++) {
            if (names[i] != obj.first_name && names[i] != "" && names[i].length > 0) {
                obj.last_name = names[i];
                break;
            }
        }
        return obj;
    };
    SigninPage.prototype.googleOnBrowser = function () {
        var _this = this;
        try {
            console.log("In not cordova");
            var provider = new __WEBPACK_IMPORTED_MODULE_12_firebase___default.a.auth.GoogleAuthProvider();
            __WEBPACK_IMPORTED_MODULE_12_firebase___default.a.auth().signInWithPopup(provider)
                .then(function (result) {
                _this.registerRequest.email = result.user.email;
                _this.registerRequest.first_name = _this.getNames(result.user.displayName).first_name;
                _this.registerRequest.last_name = _this.getNames(result.user.displayName).last_name;
                console.log(_this.registerRequest);
                _this.dismissLoading();
                _this.translate.get('google_success_auth2').subscribe(function (value) {
                    _this.presentLoading(value);
                });
                // this.presentLoading('Firebase authenticated google signup, creating user..');
                _this.checkUser();
                console.log(result);
            }).catch(function (error) {
                console.log(error);
                _this.dismissLoading();
            });
        }
        catch (err) {
            console.log(err);
        }
    };
    SigninPage.prototype.fbOnPhone = function () {
        var _this = this;
        console.log("In cordova");
        this.facebook.login(["public_profile", 'user_friends', 'email'])
            .then(function (response) {
            _this.dismissLoading();
            _this.translate.get('fb_success_auth1').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Facebook signup success, authenticating with firebase');
            var facebookCredential = __WEBPACK_IMPORTED_MODULE_12_firebase___default.a.auth.FacebookAuthProvider
                .credential(response.authResponse.accessToken);
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].USER_API_KEY, response.authResponse.accessToken);
            __WEBPACK_IMPORTED_MODULE_12_firebase___default.a.auth().signInWithCredential(facebookCredential)
                .then(function (success) {
                _this.registerRequest.email = success.email;
                _this.registerRequest.first_name = _this.getNames(success.displayName).first_name;
                _this.registerRequest.last_name = _this.getNames(success.displayName).last_name;
                _this.dismissLoading();
                _this.translate.get('fb_success_auth2').subscribe(function (value) {
                    _this.presentLoading(value);
                });
                // this.presentLoading('Firebase authenticated Facebook login, creating user..');
                _this.checkUser();
            });
        }).catch(function (error) {
            console.log(error);
            // this.showToast("Error in Facebook login");
            _this.dismissLoading();
        });
    };
    SigninPage.prototype.fbOnBrowser = function () {
        var _this = this;
        console.log("In not cordova");
        var provider = new __WEBPACK_IMPORTED_MODULE_12_firebase___default.a.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        provider.addScope('user_friends');
        provider.addScope('email');
        provider.addScope('public_profile');
        __WEBPACK_IMPORTED_MODULE_12_firebase___default.a.auth().signInWithPopup(provider)
            .then(function (result) {
            _this.registerRequest.email = result.user.email;
            _this.registerRequest.first_name = _this.getNames(result.user.displayName).first_name;
            _this.registerRequest.last_name = _this.getNames(result.user.displayName).last_name;
            _this.dismissLoading();
            _this.translate.get('fb_success_auth2').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Firebase authenticated Facebook login, creating user..');
            _this.checkUser();
        }).catch(function (error) {
            console.log(error);
            _this.dismissLoading();
            // this.showToast("Facebook login unsuccessfull");
        });
    };
    SigninPage.prototype.checkUser = function () {
        this.dismissLoading();
        var component = this;
        component.translate.get('check_token').subscribe(function (value) {
            component.presentLoading(value);
        });
        // component.presentLoading("Getting the user token");
        __WEBPACK_IMPORTED_MODULE_12_firebase___default.a.auth().currentUser.getIdToken(false)
            .then(function (idToken) {
            component.dismissLoading();
            component.translate.get('check_user').subscribe(function (value) {
                component.presentLoading(value);
            });
            // component.presentLoading("Checking the user");
            component.service.checkToken(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), idToken)
                .subscribe(function (data) {
                console.log("User exist:---");
                console.log(JSON.stringify(data));
                // user exists
                var authResponse = data;
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
                component.getUser(component.getUserIdFromToken(authResponse.token));
                component.dismissLoading();
            }, function (err) {
                // if error code is 404, user not exists
                console.log("User not exist");
                component.dismissLoading();
                component.verifyPhone();
            });
        }).catch(function (error) {
            console.log("error");
        });
    };
    SigninPage.prototype.verifyPhone = function () {
        var obj = JSON.parse(JSON.stringify(this.registerRequest));
        window.localStorage.setItem('userCreateData', JSON.stringify(obj));
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__phone_phone__["a" /* PhonePage */]);
    };
    SigninPage.prototype.singIn = function () {
        var _this = this;
        if (this.credentials.username.length == 0 || this.credentials.password.length == 0) {
            this.translate.get('login_box_empty').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Username or Password cannot be empty!');
        }
        else {
            this.translate.get('loging').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Logging in');
            var subscription = this.service.getAuthToken(this.credentials).subscribe(function (data) {
                var authResponse = data;
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
                _this.getUser(_this.getUserIdFromToken(authResponse.token));
            }, function (err) {
                _this.authError = err.error.message;
                var pos = _this.authError.indexOf('<a');
                if (pos != -1) {
                    _this.authError = _this.authError.substr(0, pos) + '<a target="_blank" ' + _this.authError.substr(pos + 2, _this.authError.length - 1);
                }
                _this.dismissLoading();
                //this.presentErrorAlert("Unable to login with provided credentials");
            });
            this.subscriptions.push(subscription);
        }
    };
    SigninPage.prototype.getUser = function (userId) {
        var _this = this;
        var subscription = this.service.getUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), userId).subscribe(function (data) {
            _this.dismissLoading();
            var userResponse = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(userResponse));
            if (userResponse.billing && userResponse.billing.address_1 && userResponse.billing.address_1.length && userResponse.billing.address_2 && userResponse.billing.address_2.length) {
                userResponse.billing.id = -100;
                var addresses = new Array();
                addresses.push(userResponse.billing);
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS, JSON.stringify(userResponse.billing));
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST, JSON.stringify(addresses));
            }
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
            _this.events.publish('user:login');
            _this.events.publish('tab:index', 0);
        }, function (err) {
            _this.dismissLoading();
            _this.translate.get('login_error').subscribe(function (value) {
                _this.presentErrorAlert(value);
            });
            // this.presentErrorAlert("Unable to login with provided credentials");
        });
        this.subscriptions.push(subscription);
    };
    SigninPage.prototype.getUserIdFromToken = function (token) {
        var decodedString = window.atob(token.split(".")[1]);
        return JSON.parse(decodedString).data.user.id;
    };
    SigninPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    SigninPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    SigninPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        // let alert = this.alertCtrl.create({
        //   title: this.translate.get('error'),
        //   subTitle: msg,
        //   buttons: [this.translate.get('dismiss')]
        // });
        // alert.present();
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    SigninPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SigninPage.prototype.signupPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__signup_signup__["a" /* SignupPage */]);
    };
    SigninPage.prototype.homePage = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
    };
    SigninPage.prototype.passwordPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__password_password__["a" /* PasswordPage */]);
    };
    SigninPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-signin',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/signin/signin.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{\'login\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding-top>\n\n  <ion-list class="default-form" padding-right>\n\n    <ion-item>\n\n      <ion-label floating>{{\'phone\' | translate}}</ion-label>\n\n      <ion-input type="tel" [(ngModel)]="credentials.username" placeholder="{{\'phone\' | translate}}"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>{{\'password\' | translate}}</ion-label>\n\n      <ion-input type="password" [(ngModel)]="credentials.password" placeholder="{{\'password\' | translate}}"></ion-input>\n\n    </ion-item>\n\n    <p text-center [innerHTML]="authError"></p>\n\n    <span class="forgot text-green" (click)="passwordPage()">{{\'forgot\' | translate}}?</span>\n\n  </ion-list>\n\n  <ion-row class="btn-style" padding>\n\n    <ion-col col-7>\n\n      <p class="text-light">{{\'no_account\' | translate}}?\n\n        <br>\n\n        <span (click)="signupPage()" class="text-green">{{\'register\' | translate}}</span>\n\n      </p>\n\n    </ion-col>\n\n    <ion-col col-5>\n\n      <button ion-button clear icon-end (click)="singIn()">\n\n        {{\'login\' | translate}}\n\n        <ion-icon name="arrow-forward"></ion-icon>\n\n      </button>\n\n    </ion-col>\n\n  </ion-row>\n\n  <p text-center style="margin-bottom:15px">{{\'or_continue_with\' | translate}}</p>\n\n  <ion-list class="default-form social-buttons" padding-right padding-left>\n\n   \n\n    <button ion-button full icon-left class="btn-social btn-google" (click)="loginGoogle()" style="margin-top:15px">\n\n      <ion-icon class="icon">\n\n        <img src="assets/imgs/google.png">\n\n      </ion-icon>\n\n      <span>Google</span>\n\n    </button>\n\n  </ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/signin/signin.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Inject */])(__WEBPACK_IMPORTED_MODULE_11__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_13__ionic_native_facebook__["a" /* Facebook */],
            __WEBPACK_IMPORTED_MODULE_10__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_14__ionic_native_google_plus__["a" /* GooglePlus */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */]])
    ], SigninPage);
    return SigninPage;
}());

//# sourceMappingURL=signin.js.map

/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PasswordPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PasswordPage = /** @class */ (function () {
    function PasswordPage(translate, toastCtrl, navCtrl, service, loadingCtrl) {
        this.translate = translate;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.loadingShown = false;
        this.subscriptions = [];
    }
    PasswordPage.prototype.resetPassword = function () {
        var _this = this;
        if (this.userLogin && this.userLogin.length) {
            this.translate.get('resetting_mail').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Initiating reset email request.');
            var subscription = this.service.resetPassword(this.userLogin).subscribe(function (data) {
                _this.dismissLoading();
                _this.navCtrl.pop();
            }, function (err) {
                _this.dismissLoading();
                _this.navCtrl.pop();
            });
            this.subscriptions.push(subscription);
        }
        else {
            this.translate.get('field_error_valid_username').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter valid username');
        }
    };
    PasswordPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    PasswordPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    PasswordPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    PasswordPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-password',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/password/password.html"*/'<!--\n\n  Generated template for the PasswordPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>{{\'Reset password\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding-top>\n\n    <h5 text-center>{{\'reset_password\' | translate}}!</h5>\n\n    <p text-center class="text-light">{{\'reset_password1\' | translate}}\n\n        <br>{{\'reset_password2\' | translate}}</p>\n\n    <ion-list class="default-form">\n\n        <ion-item>\n\n            <ion-label floating>{{\'reset_password_box\' | translate}}</ion-label>\n\n            <ion-input type="text" text-right  [(ngModel)]="userLogin"></ion-input>\n\n        </ion-item>\n\n    </ion-list>\n\n    <ion-row padding class="btn-style">\n\n        <!-- <ion-col col-7>\n\n            <p class="text-light">Remembered passeord?\n\n                <br>\n\n                <span (click)="signin()" class="text-green">BACK TO SIGNIN</span>\n\n            </p>\n\n        </ion-col> -->\n\n\n\n        <ion-col col-5>\n\n            <button ion-button clear icon-end (click)="resetPassword()">{{\'submit\' | translate}}\n\n                <ion-icon name="arrow-forward"></ion-icon>\n\n            </button>\n\n        </ion-col>\n\n    </ion-row>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/password/password.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
    ], PasswordPage);
    return PasswordPage;
}());

//# sourceMappingURL=password.js.map

/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__otp_otp__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_register_request_models__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_auth_credential_models__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var SignupPage = /** @class */ (function () {
    function SignupPage(translate, events, toastCtrl, navCtrl, service, loadingCtrl, alertCtrl) {
        this.translate = translate;
        this.events = events;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingShown = false;
        this.authError = "";
        this.subscriptions = [];
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_5__models_register_request_models__["a" /* RegisterRequest */]('', '', '');
        this.registerRequestPasswordConfirm = '';
        this.countryCode = '';
        this.countries = [];
    }
    SignupPage.prototype.ionViewDidLoad = function () {
        this.getCountries();
    };
    SignupPage.prototype.getCountries = function () {
        var _this = this;
        this.service.getCountries().subscribe(function (data) {
            console.log("Countries fetched");
            _this.countries = data;
            // console.log(data);
        }, function (err) {
            console.log(err);
        });
    };
    SignupPage.prototype.register = function () {
        var _this = this;
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (this.registerRequest.first_name == "" || !this.registerRequest.first_name.length) {
            this.translate.get('field_error_name_first').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Please enter your first name');
        }
        else if (this.registerRequest.last_name == "" || !this.registerRequest.last_name.length) {
            this.translate.get('field_error_name_last').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Please enter your last name');      
        }
        if (this.registerRequest.username.length != 10) {
            this.translate.get('field_error_phone_valid').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter username atleast 4 char long');
        }
        else if (this.registerRequest.email.length <= 5 || !reg.test(this.registerRequest.email)) {
            this.translate.get('field_error_email').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter valid email address');
        }
        else if (this.registerRequest.password.length == 0 || !(this.registerRequest.password === this.registerRequestPasswordConfirm)) {
            this.translate.get('field_error_password').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast('Enter valid passwords, twice.');
        }
        else {
            this.translate.get('loading_sign_up').subscribe(function (value) {
                _this.presentLoading(value);
            });
            // this.presentLoading('Registering user');
            var subscription = this.service.createUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.registerRequest).subscribe(function (data) {
                _this.dismissLoading();
                _this.translate.get('signup_success').subscribe(function (value) {
                    _this.showToast(value);
                });
                _this.registerResponse = data;
                _this.verifyPhone();
                // this.showToast('Registration success.');
                // let registerResponse: RegisterResponse = data;
                // this.signIn(String(registerResponse.id), this.registerRequest.username, this.registerRequest.password);
            }, function (err) {
                /*this.authError = err.error.message;
                        let pos = this.authError.indexOf('<a');
                        if (pos != -1) {
                            this.authError = this.authError.substr(0, pos) + '<a target="_blank" ' + this.authError.substr(pos + 2, this.authError.length - 1);
                        }*/
                _this.translate.get('signup_error').subscribe(function (value) {
                    _this.presentErrorAlert(value);
                });
                _this.dismissLoading();
                //this.presentErrorAlert("Unable to register with provided credentials");
            });
            this.subscriptions.push(subscription);
        }
    };
    SignupPage.prototype.verifyPhone = function () {
        var obj = JSON.parse(JSON.stringify(this.registerRequest));
        window.localStorage.setItem('userCreateData', JSON.stringify(obj));
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__otp_otp__["a" /* OtpPage */], { userId: this.registerResponse.id, dialCode: this.countryCode });
    };
    SignupPage.prototype.signIn = function (userId, username, password) {
        var _this = this;
        var credentials = new __WEBPACK_IMPORTED_MODULE_7__models_auth_credential_models__["a" /* AuthCredential */](username, password);
        var subscription = this.service.getAuthToken(credentials).subscribe(function (data) {
            var authResponse = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
            _this.getUser(userId);
        }, function (err) {
            _this.dismissLoading();
            _this.translate.get('login_error').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.presentErrorAlert("Unable to login with provided credentials");
        });
        this.subscriptions.push(subscription);
    };
    SignupPage.prototype.getUser = function (userId) {
        var _this = this;
        var subscription = this.service.getUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), userId).subscribe(function (data) {
            _this.dismissLoading();
            var userResponse = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(userResponse));
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
            _this.events.publish('user:login');
            _this.events.publish('tab:index', 0);
        }, function (err) {
            _this.dismissLoading();
            _this.translate.get('login_error').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.presentErrorAlert("Unable to login with provided credentials");
        });
        this.subscriptions.push(subscription);
    };
    SignupPage.prototype.signinPage = function () {
        this.navCtrl.pop();
    };
    SignupPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    SignupPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    SignupPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    SignupPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SignupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-signup',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/signup/signup.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>{{\'register1\' | translate}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding-top>\n\n  <ion-list class="default-form" padding-right>\n\n    <ion-item>\n\n      <ion-label floating>{{\'address_first_name\' | translate}}</ion-label>\n\n      <ion-input type="text" text-right [(ngModel)]="registerRequest.first_name" placeholder="{{\'address_first_name\' | translate}}"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>{{\'address_last_name\' | translate}}</ion-label>\n\n      <ion-input type="text" text-right [(ngModel)]="registerRequest.last_name" placeholder="{{\'address_last_name\' | translate}}"></ion-input>\n\n    </ion-item>\n\n    <ion-item *ngIf="countries && countries.length">\n\n      <ion-label>{{ "address_country" | translate }}</ion-label>\n\n      <ion-select [(ngModel)]="countryCode"placeholder="{{\'select\' | translate}}" multiple="false" okText="{{\'okay\' | translate}}" cancelText="{{\'cancel\' | translate}}">\n\n        <ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries" >{{country.name}}</ion-option>\n\n      </ion-select>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>{{\'phone\' | translate}}</ion-label>\n\n      <ion-input type="tel" text-right [(ngModel)]="registerRequest.username" placeholder="{{\'phone\' | translate}}"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>{{\'email\' | translate}}</ion-label>\n\n      <ion-input type="email" text-right [(ngModel)]="registerRequest.email" placeholder="{{\'email\' | translate}}"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>{{\'password\' | translate}}</ion-label>\n\n      <ion-input type="password" text-right [(ngModel)]="registerRequest.password" placeholder="{{\'password\' | translate}}"></ion-input>\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating>{{\'c_password\' | translate}}</ion-label>\n\n      <ion-input type="password" text-right [(ngModel)]="registerRequestPasswordConfirm" placeholder=""></ion-input>\n\n    </ion-item>\n\n  </ion-list>\n\n  <p text-center [innerHTML]="authError"></p>\n\n  <ion-row class="btn-style" padding>\n\n    <ion-col col-7>\n\n      <p class="text-light">{{\'already_account\' | translate}}{{\'c_password\' | translate}}?\n\n        <br>\n\n        <span (click)="signinPage()" class="text-green">{{\'signin_now\' | translate}}</span>\n\n      </p>\n\n    </ion-col>\n\n    <ion-col col-5>\n\n      <button ion-button clear icon-end (click)="register()">{{\'register\' | translate}}\n\n          <ion-icon name="arrow-forward"></ion-icon>\n\n      </button>\n\n    </ion-col>\n\n  </ion-row>\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/signup/signup.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_8__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], SignupPage);
    return SignupPage;
}());

//# sourceMappingURL=signup.js.map

/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PhonePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_firebase__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_otp_otp__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_register_request_models__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_wordpress_client_service__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Generated class for the PhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
/*@IonicPage()*/
var PhonePage = /** @class */ (function () {
    function PhonePage(navCtrl, alertCtrl, loadingCtrl, toastCtrl, view, firebase, platform, events, service, translate) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.view = view;
        this.firebase = firebase;
        this.platform = platform;
        this.events = events;
        this.service = service;
        this.translate = translate;
        this.loadingShown = false;
        this.captchanotvarified = true;
        this.buttonDisabled = true;
        this.otpNotsent = false;
        this.countryCode = '';
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_5__models_register_request_models__["a" /* RegisterRequest */]('', '', '');
        this.subscriptions = [];
        // this.platform.registerBackButtonAction(() => {
        //   this.makeExitAlert();
        // },1);
    }
    PhonePage.prototype.ionViewDidLoad = function () {
        console.log("Phone Page");
        this.registerRequest = JSON.parse(window.localStorage.getItem('userCreateData'));
        console.log("Previous data is:--" + JSON.stringify(this.registerRequest));
        this.checkNumber();
        this.getCountries();
    };
    PhonePage.prototype.getCountries = function () {
        var _this = this;
        this.service.getCountries().subscribe(function (data) {
            console.log("Countries fetched");
            _this.countries = data;
            // console.log(data);
        }, function (err) {
            console.log(err);
        });
    };
    PhonePage.prototype.checkNumber = function () {
        var _this = this;
        if (!this.countryCode || this.countryCode == '') {
            this.buttonDisabled = true;
            this.translate.get('field_error_country').subscribe(function (value) {
                _this.showToast(value);
            });
            this.registerRequest.username = '';
            return;
        }
        this.phoneNumber = JSON.parse(JSON.stringify(this.registerRequest.username));
        if (isNaN(this.phoneNumber)) {
            this.buttonDisabled = true;
            this.translate.get('field_error_phone_valid').subscribe(function (value) {
                _this.showToast(value);
            });
            return;
        }
        else if (this.phoneNumber.length > 10) {
            this.buttonDisabled = true;
            setTimeout(function () {
                _this.phoneNumber = _this.phoneNumber.slice(0, 10);
            }, 100);
            return;
        }
        else if (this.phoneNumber.length == 10 && this.phoneNumber != '' && !isNaN(this.phoneNumber)) {
            this.buttonDisabled = false;
            return false;
        }
        else {
            this.buttonDisabled = true;
            return false;
        }
    };
    PhonePage.prototype.createUser = function () {
        var _this = this;
        if (!this.phoneNumber || this.phoneNumber == '') {
            this.buttonDisabled = true;
            this.translate.get('field_error_phone_valid').subscribe(function (value) {
                _this.showToast(value);
            });
            return;
        }
        this.translate.get('check_phone').subscribe(function (value) {
            _this.presentLoading(value);
        });
        // this.presentLoading("Checking mobile no...")
        this.registerRequest.password = Math.random().toString(36).slice(-6);
        console.log(JSON.stringify(this.registerRequest));
        var subscription = this.service.createUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.registerRequest)
            .subscribe(function (data) {
            _this.dismissLoading();
            _this.registerResponse = data;
            _this.verifyOtp();
            //user not found now we can send the sms on this number
        }, function (err) {
            _this.translate.get('mobile_exist').subscribe(function (value) {
                _this.showToast(value);
            });
            // this.showToast("Mobile no. already registered");
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    PhonePage.prototype.verifyOtp = function () {
        console.log("COuntry code is ", this.countryCode);
        window.localStorage.setItem('userCreateData', JSON.stringify(this.registerRequest));
        // this.navCtrl.setRoot(OtpPage,{})
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__pages_otp_otp__["a" /* OtpPage */], { userId: this.registerResponse.id, dialCode: this.countryCode });
    };
    PhonePage.prototype.makeExitAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Application exit prevented!');
                    }
                }, {
                    text: 'Close App',
                    handler: function () {
                        _this.platform.exitApp(); // Close this application
                    }
                }]
        });
        alert.present();
    };
    PhonePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    PhonePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    PhonePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    PhonePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-phone',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/phone/phone.html"*/'<ion-header>\n\n  <ion-navbar>\n\n      <ion-title text-center></ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <div class="form" padding-left padding-right>\n\n    <p text-center>{{\'enter_phone_text\' | translate}} <br/>{{\'enter_phone_text1\' | translate}}</p>\n\n    <ion-list>\n\n      <ion-item>\n\n        <ion-label>{{\'address_country\' | translate}}</ion-label>\n\n        <ion-select [(ngModel)]="countryCode" placeholder="{{\'select\' | translate}}"okText="{{\'okay\' | translate}}" cancelText="{{\'cancel\' | translate}}" multiple="false">\n\n          <ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries" >{{country.name}}</ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>{{\'phone\' | translate}}</ion-label>\n\n        <ion-input type="text" text-right placeholder="{{\'phone\' | translate}}" [(ngModel)]="registerRequest.username" (ngModelChange)="checkNumber($event)"></ion-input>\n\n      </ion-item>\n\n    </ion-list>\n\n    <button ion-button full class="bg-thime btn-round btn-text" (click)="createUser()" [disabled]="buttonDisabled">\n\n      {{\'Continue\' | translate}}        \n\n    </button>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/phone/phone.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_7__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_firebase__["a" /* Firebase */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_7__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__["c" /* TranslateService */]])
    ], PhonePage);
    return PhonePage;
}());

//# sourceMappingURL=phone.js.map

/***/ }),

/***/ 248:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FavoritesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__itemsinfo_itemsinfo__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global__ = __webpack_require__(36);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var FavoritesPage = /** @class */ (function () {
    function FavoritesPage(global, navCtrl, navParams) {
        this.global = global;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.products = new Array();
    }
    FavoritesPage.prototype.ionViewDidEnter = function () {
        this.global.refreshFavorites();
        this.products = this.global.getFavorites();
    };
    FavoritesPage.prototype.itemsinfo = function (pro) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__itemsinfo_itemsinfo__["a" /* ItemsinfoPage */], { pro: pro });
    };
    FavoritesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-favorites',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/favorites/favorites.html"*/'<ion-header>\n\n\n\n    <ion-navbar>\n\n        <ion-title>{{\'favorite\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n    <ion-list *ngIf="products && products.length" no-lines>\n\n        <ion-item *ngFor="let pro of products">\n\n            <ion-thumbnail item-start>\n\n                <figure *ngIf="pro.images && pro.images.length" (click)="itemsinfo(pro)">\n\n                    <img data-src="{{pro.images[0].src}}">\n\n                </figure>\n\n                <figure *ngIf="!pro.images || !pro.images.length" (click)="itemsinfo(pro)">\n\n                    <img src="assets/imgs/img_1.png">\n\n                </figure>\n\n            </ion-thumbnail>\n\n            <h2 (click)="itemsinfo(pro)">{{pro.name}}</h2>\n\n            <p (click)="itemsinfo(pro)" [innerHTML]="pro.short_description"></p>\n\n            <ion-row>\n\n                <ion-col col-12 class="text-green">\n\n                    <p *ngIf="pro.type == \'simple\'" [innerHTML]="pro.sale_price_html"></p>\n\n                    <p *ngIf="pro.type == \'variable\'" [innerHTML]="pro.price_html"></p>\n\n                </ion-col>\n\n            </ion-row>\n\n        </ion-item>\n\n    </ion-list>\n\n\n\n    <div *ngIf="!products || !products.length" class="empty">\n\n        <div>\n\n            <img src="assets/imgs/empty.png">\n\n            <p>{{\'favorite_empty\' | translate}}!</p>\n\n        </div>\n\n    </div>\n\n\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/favorites/favorites.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], FavoritesPage);
    return FavoritesPage;
}());

//# sourceMappingURL=favorites.js.map

/***/ }),

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AccountPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profile_profile__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__address_address__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__orders_orders__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__about_about__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__tnc_tnc__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__contact_contact__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__node_modules_ionic_native_social_sharing__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var AccountPage = /** @class */ (function () {
    function AccountPage(translate, socialSharing, alertCtrl, events, navCtrl, navParams) {
        var _this = this;
        this.translate = translate;
        this.socialSharing = socialSharing;
        this.alertCtrl = alertCtrl;
        this.events = events;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        events.subscribe('user:login', function () {
            _this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_KEY));
        });
    }
    AccountPage.prototype.ionViewDidEnter = function () {
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_KEY));
        // this.navCtrl.push(SigninPage);
    };
    AccountPage.prototype.profile = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__profile_profile__["a" /* ProfilePage */]);
    };
    AccountPage.prototype.address = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__address_address__["a" /* AddressPage */], { choose: false });
    };
    AccountPage.prototype.orders = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__orders_orders__["a" /* OrdersPage */]);
    };
    AccountPage.prototype.about = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__about_about__["a" /* AboutPage */]);
    };
    AccountPage.prototype.tnc = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__tnc_tnc__["a" /* TncPage */]);
    };
    AccountPage.prototype.contact = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__contact_contact__["a" /* ContactPage */]);
    };
    AccountPage.prototype.shareApp = function () {
        this.socialSharing.share('Hey, I found this delivery app.', null, null, 'https://play.google.com/store/apps/details?id=com.techlytx.greekdelivery')
            .then(function (res) {
            console.log("Shared");
        }).catch(function (err) {
            console.log(JSON.stringify(err));
        });
    };
    AccountPage.prototype.signIn = function () {
        // this.navCtrl.push(SigninPage);
        this.events.publish('tab:index', 0);
        this.events.publish('go:to', 'auth');
    };
    AccountPage.prototype.logout = function () {
        var _this = this;
        var errortitle = this.translate.instant('logout');
        var alert = this.alertCtrl.create({
            title: errortitle,
            message: this.translate.instant('logout_message'),
            buttons: [{
                    text: this.translate.instant('yes'),
                    handler: function () {
                        _this.user = null;
                        _this.events.publish('tab:index', 0);
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_KEY, null);
                    }
                },
                {
                    text: this.translate.instant('no'),
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }]
        });
        alert.present();
    };
    AccountPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-account',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/account/account.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title *ngIf="user">\n\n      <span *ngIf="user.first_name !==\'\' && user.last_name !==\'\'">\n\n        {{user.first_name}} {{user.last_name}}\n\n      </span>\n\n      <span *ngIf="user.first_name ==\'\' || user.last_name ==\'\'">\n\n        {{user.username}}\n\n      </span>\n\n    </ion-title>\n\n    <ion-title *ngIf="!user">{{\'guest\' | translate}}</ion-title>\n\n    <p *ngIf="user">{{user.email}}\n\n        <span (click)="logout()">{{\'logout\' | translate}}</span>\n\n    </p>\n\n    <p *ngIf="!user">\n\n        <span (click)="signIn()">{{\'login\' | translate}}</span>\n\n    </p>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n  <ion-list *ngIf="user" no-lines>\n\n    <ion-item (click)="profile()">\n\n      <ion-icon name="md-person" item-start></ion-icon>\n\n         {{\'profile\' | translate}}\n\n    </ion-item>\n\n    <ion-item (click)="address()">\n\n      <ion-icon name="md-pin" item-start></ion-icon>\n\n        {{\'my_address\' | translate}}\n\n    </ion-item>\n\n    <ion-item (click)="orders()">\n\n      <ion-icon name="md-basket" item-start></ion-icon>\n\n        {{\'my_orders\' | translate}}\n\n    </ion-item>\n\n  </ion-list>\n\n  <p *ngIf="user" padding class="text-light">{{\'More info\' | translate}}</p>\n\n  <ion-list no-lines>\n\n   \n\n   \n\n    <ion-item (click)="contact()">\n\n      <ion-icon name="md-navigate" item-start></ion-icon>\n\n      {{\'Connect us\' | translate}}\n\n    </ion-item>\n\n    <ion-item (click)="shareApp()">\n\n      <ion-icon name="md-person-add" item-start></ion-icon>\n\n      {{\'Share app\' | translate}}\n\n        \n\n    </ion-item>\n\n  </ion-list>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/account/account.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_10__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_9__node_modules_ionic_native_social_sharing__["a" /* SocialSharing */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], AccountPage);
    return AccountPage;
}());

//# sourceMappingURL=account.js.map

/***/ }),

/***/ 250:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ProfilePage = /** @class */ (function () {
    function ProfilePage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].USER_KEY));
        this.selectedAddress = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS));
    }
    ProfilePage.prototype.isReadonly = function () { return true; };
    ProfilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-profile',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/profile/profile.html"*/'<!--\n\n  Generated template for the ProfilePage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n    <ion-navbar>\n\n        <ion-title>{{\'My Account\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content class="bg-light">\n\n    <ion-list *ngIf="user" padding class="default-form">\n\n        <ion-item>\n\n          <ion-label floating>{{\'address_first_name\' | translate}}</ion-label>\n\n          <ion-input type="text" [readonly]="isReadonly()" [(ngModel)]="user.first_name"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n          <ion-label floating>{{\'address_last_name\' | translate}}</ion-label>\n\n          <ion-input type="text" [readonly]="isReadonly()" [(ngModel)]="user.last_name"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n          <ion-label floating>{{\'username\' | translate}}</ion-label>\n\n          <ion-input type="text" [readonly]="isReadonly()" [(ngModel)]="user.username"></ion-input>\n\n        </ion-item>\n\n        <ion-item>\n\n          <ion-label floating>{{\'email\' | translate}}</ion-label>\n\n          <ion-input type="text" [readonly]="isReadonly()" [(ngModel)]="user.email"></ion-input>\n\n        </ion-item>\n\n        <ion-item *ngIf="selectedAddress">\n\n          <ion-label floating>{{\'phone\' | translate}}</ion-label>\n\n          <ion-input type="text" [readonly]="isReadonly()" [(ngModel)]="selectedAddress.phone"></ion-input>\n\n        </ion-item>\n\n    </ion-list>\n\n    <!-- <div class="fixed-bottom">\n\n        <button ion-button full class="btn btn-green">Update informaion</button>\n\n    </div> -->\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/profile/profile.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], ProfilePage);
    return ProfilePage;
}());

//# sourceMappingURL=profile.js.map

/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AboutPage = /** @class */ (function () {
    function AboutPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    AboutPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AboutPage');
    };
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-about',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/about/about.html"*/'<ion-header class="bg-transparent">\n\n    <ion-navbar>\n\n        <ion-title>{{\'about\' | translate}}</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content class="bg-light">\n\n    <div class="img-box">\n\n        <img src="assets/imgs/restroimage.png">\n\n    </div>\n\n    <ion-card>\n\n        <p>{{\'about1\' | translate}}</p>\n\n        <p>{{\'about2\' | translate}}</p>\n\n    </ion-card>\n\n    <ion-card>\n\n        <p>{{\'about3\' | translate}}</p>\n\n        <p>{{\'about4\' | translate}}</p>\n\n    </ion-card>\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/about/about.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 252:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TncPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the TncPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var TncPage = /** @class */ (function () {
    function TncPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    TncPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad TncPage');
    };
    TncPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-tnc',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/tnc/tnc.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>{{\'tnc\' | translate}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content class="bg-light">\n\n  <ion-card class="card logo">\n\n    <div class="img-box" text-center>\n\n      <img src="assets/imgs/logo.png" class="logo">\n\n    </div>\n\n  </ion-card>\n\n  <ion-card>\n\n    <h2>{{\'tnc_use\' | translate}}</h2>\n\n    <p>{{\'tnc_use_ext\' | translate}}.</p>\n\n\n\n    <h2>{{\'tnc_billing\' | translate}}</h2>\n\n    <p>{{\'tnc_billing_text\' | translate}}</p>\n\n  </ion-card>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/tnc/tnc.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], TncPage);
    return TncPage;
}());

//# sourceMappingURL=tnc.js.map

/***/ }),

/***/ 253:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_ionic_native_call_number__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_ionic_native_email_composer__ = __webpack_require__(255);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ContactPage = /** @class */ (function () {
    function ContactPage(emailComposer, callNumber, navCtrl, navParams) {
        this.emailComposer = emailComposer;
        this.callNumber = callNumber;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.latitude = 28.634418;
        this.longitude = 77.219184;
    }
    ContactPage.prototype.dial = function () {
        this.callNumber.callNumber("+19876543210", true)
            .then(function (res) { return console.log('Launched dialer!', res); })
            .catch(function (err) { return console.log('Error launching dialer', err); });
    };
    ContactPage.prototype.mail = function () {
        var _this = this;
        this.emailComposer.isAvailable().then(function (available) {
            if (available) {
                var email = {
                    to: 'thomas@greekdelivery.in',
                    subject: 'Contact Greek',
                    body: '',
                    isHtml: true
                };
                // Send a text message using default options
                _this.emailComposer.open(email);
            }
        });
    };
    ContactPage.prototype.openMap = function () {
        window.open('https://www.google.com/maps/dir/?api=1&destination=' + this.latitude + ',' + this.longitude);
    };
    ContactPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-contact',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/contact/contact.html"*/'<ion-header class="bg-transparent">\n\n    <ion-navbar>\n\n        <ion-title>&nbsp;</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n    <div class="map-box">\n\n        <img src="assets/imgs/map.png">\n\n        <ion-card>\n\n            <ion-row>\n\n                <ion-col col-9>\n\n                    <h2>{{\'Greek Online Foods\' | translate}}</h2>\n\n                    <p>{{\'Kunnumchirayil building\' | translate}}\n\n                    <br>{{\'Manakkadu\' | translate}}\n\n                    <br>{{\'Thodupuzha \' | translate}}</p>\n\n                </ion-col>\n\n                <ion-col col-3 text-end>\n\n                    <ion-icon name="md-navigate" (click)="openMap()"></ion-icon>\n\n                </ion-col>\n\n            </ion-row>\n\n        </ion-card>\n\n    </div>\n\n    <ion-card>\n\n        <ion-row>\n\n            <ion-col col-9>\n\n                <p>{{\'Call us\' | translate}}</p>\n\n                <h2>+91 7012800595</h2>\n\n            </ion-col>\n\n            <ion-col col-3 text-end>\n\n                <ion-icon name="md-call" (click)="dial()"></ion-icon>\n\n            </ion-col>\n\n        </ion-row>\n\n\n\n        <ion-row>\n\n            <ion-col col-9>\n\n                <p>{{\'Mail us\' | translate}}</p>\n\n                <h2>help@greekdelivery.in</h2>\n\n            </ion-col>\n\n            <ion-col col-3 text-end>\n\n                <ion-icon name="md-mail" (click)="mail()"></ion-icon>\n\n            </ion-col>\n\n        </ion-row>\n\n\n\n        <!-- <ion-row class="social-media">\n\n            <ion-col col-12>\n\n                <p>{{\'social_msg\' | translate}}</p>\n\n            </ion-col>\n\n            <ion-col col-12>\n\n                <ion-row>\n\n                    <ion-col col-4>\n\n                        <h2 href="#" onclick="window.open(\'https://www.facebook.com/\', \'_system\')">\n\n                            <ion-icon name="logo-facebook"></ion-icon>\n\n                            <span>{{\'like\' | translate}}</span>\n\n                        </h2>\n\n                    </ion-col>\n\n                    <ion-col col-4>\n\n                        <h2 href="#" onclick="window.open(\'https://www.instagram.com\', \'_system\')">\n\n                            <ion-icon name="logo-instagram"></ion-icon>\n\n                            <span>{{\'follow\' | translate}}</span>\n\n                        </h2>\n\n                    </ion-col>\n\n                    <ion-col col-4>\n\n                        <h2 href="#" onclick="window.open(\'https://twitter.com/\', \'_system\')">\n\n                            <ion-icon name="logo-twitter"></ion-icon>\n\n                            <span>{{\'follow\' | translate}}</span>\n\n                        </h2>\n\n                    </ion-col>\n\n                </ion-row>\n\n            </ion-col>\n\n        </ion-row> -->\n\n    </ion-card>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/contact/contact.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__node_modules_ionic_native_email_composer__["a" /* EmailComposer */], __WEBPACK_IMPORTED_MODULE_2__node_modules_ionic_native_call_number__["a" /* CallNumber */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], ContactPage);
    return ContactPage;
}());

//# sourceMappingURL=contact.js.map

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WalkthoughPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tabs_tabs__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var WalkthoughPage = /** @class */ (function () {
    function WalkthoughPage(events, navCtrl, translateService, navParams) {
        this.events = events;
        this.navCtrl = navCtrl;
        this.translateService = translateService;
        this.navParams = navParams;
    }
    WalkthoughPage.prototype.ngAfterViewInit = function () {
        this.slider.freeMode = true;
    };
    WalkthoughPage.prototype.ionViewDidEnter = function () {
        if (this.translateService.currentLang == 'ar') {
            this.slider._rtl = true;
        }
        console.log("ionViewDidEnter");
    };
    WalkthoughPage.prototype.finish = function () {
        // if (this.translate.currentLang == 'ar') { 
        //   this.slider._rtl = true 
        // }
        window.localStorage.setItem('wt', 'shown');
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__tabs_tabs__["a" /* TabsPage */]);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Slides */])
    ], WalkthoughPage.prototype, "slider", void 0);
    WalkthoughPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-walkthough',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/walkthough/walkthough.html"*/'<ion-content padding>\n\n    <ion-slides pager>\n\n        <ion-slide>\n\n            <img src="./assets/imgs/screen2.png" class="slide-image" />\n\n            <h2 class="text-heading" innerHTML="{{\'walk_first_title\' | translate}}"></h2>\n\n            <span (click)="finish()" class="text-light">{{ "skip" | translate }}</span>\n\n        </ion-slide>\n\n        <ion-slide>\n\n            <img src="./assets/imgs/screen1.png" class="slide-image" />\n\n            <h2 class="text-heading" innerHTML="{{\'walk_second_title\' | translate}}"></h2>\n\n            <span (click)="finish()" class="text-light">{{ "Finish" | translate }}</span>\n\n        </ion-slide>\n\n       \n\n    </ion-slides>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/walkthough/walkthough.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], WalkthoughPage);
    return WalkthoughPage;
}());

//# sourceMappingURL=walkthough.js.map

/***/ }),

/***/ 259:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(273);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 273:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createTranslateLoader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component__ = __webpack_require__(274);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_http_loader__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_globalization__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_config__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_about_about__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_account_account__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_addaddress_addaddress__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_address_address__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_cart_cart__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_conaddress_conaddress__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_conpayment_conpayment__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_payment_payment__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_confirmed_confirmed__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_contact_contact__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_favorites_favorites__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_home_home__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_itemsinfo_itemsinfo__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_orders_orders__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_ordersdetail_ordersdetail__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_password_password__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_profile_profile__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_search_search__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_signin_signin__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_signup_signup__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_tabs_tabs__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_tnc_tnc__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_walkthough_walkthough__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ionic_native_status_bar__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ionic_native_splash_screen__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ionic_native_social_sharing__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__ionic_native_in_app_browser__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__ionic_native_paypal__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_mysplash_mysplash__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__pages_otp_otp__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_phone_phone__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__ionic_native_call_number__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__ionic_native_email_composer__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__pages_code_code__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__ionic_native_facebook__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ionic_native_google_plus__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__ionic_native_onesignal__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__ionic_native_device__ = __webpack_require__(224);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















































function createTranslateLoader(http) {
    return new __WEBPACK_IMPORTED_MODULE_6__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, './assets/i18n/', '.json');
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["J" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_0__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_9__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_account_account__["a" /* AccountPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_addaddress_addaddress__["a" /* AddaddressPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_address_address__["a" /* AddressPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_cart_cart__["a" /* CartPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_conaddress_conaddress__["a" /* ConaddressPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_conpayment_conpayment__["a" /* ConpaymentPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_confirmed_confirmed__["a" /* ConfirmedPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_favorites_favorites__["a" /* FavoritesPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_itemsinfo_itemsinfo__["a" /* ItemsinfoPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_orders_orders__["a" /* OrdersPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_ordersdetail_ordersdetail__["a" /* OrdersdetailPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_password_password__["a" /* PasswordPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_profile_profile__["a" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_search_search__["a" /* SearchPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_signin_signin__["a" /* SigninPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_tnc_tnc__["a" /* TncPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_walkthough_walkthough__["a" /* WalkthoughPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_payment_payment__["a" /* PaymentPage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_mysplash_mysplash__["a" /* MySplashPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_code_code__["a" /* CodePage */], __WEBPACK_IMPORTED_MODULE_38__pages_otp_otp__["a" /* OtpPage */], __WEBPACK_IMPORTED_MODULE_39__pages_phone_phone__["a" /* PhonePage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_0__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["b" /* TranslateModule */].forRoot({
                    loader: {
                        provide: __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["a" /* TranslateLoader */],
                        useFactory: createTranslateLoader,
                        deps: [__WEBPACK_IMPORTED_MODULE_3__angular_common_http__["a" /* HttpClient */]]
                    }
                })
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_2__angular_core__["i" /* CUSTOM_ELEMENTS_SCHEMA */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_0__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_9__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_account_account__["a" /* AccountPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_addaddress_addaddress__["a" /* AddaddressPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_address_address__["a" /* AddressPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_cart_cart__["a" /* CartPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_conaddress_conaddress__["a" /* ConaddressPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_conpayment_conpayment__["a" /* ConpaymentPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_confirmed_confirmed__["a" /* ConfirmedPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_favorites_favorites__["a" /* FavoritesPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_itemsinfo_itemsinfo__["a" /* ItemsinfoPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_orders_orders__["a" /* OrdersPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_ordersdetail_ordersdetail__["a" /* OrdersdetailPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_password_password__["a" /* PasswordPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_profile_profile__["a" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_search_search__["a" /* SearchPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_signin_signin__["a" /* SigninPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_tnc_tnc__["a" /* TncPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_walkthough_walkthough__["a" /* WalkthoughPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_payment_payment__["a" /* PaymentPage */],
                __WEBPACK_IMPORTED_MODULE_37__pages_mysplash_mysplash__["a" /* MySplashPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_code_code__["a" /* CodePage */], __WEBPACK_IMPORTED_MODULE_38__pages_otp_otp__["a" /* OtpPage */], __WEBPACK_IMPORTED_MODULE_39__pages_phone_phone__["a" /* PhonePage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_46__ionic_native_device__["a" /* Device */],
                __WEBPACK_IMPORTED_MODULE_32__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_33__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_36__ionic_native_paypal__["a" /* PayPal */],
                __WEBPACK_IMPORTED_MODULE_34__ionic_native_social_sharing__["a" /* SocialSharing */],
                __WEBPACK_IMPORTED_MODULE_35__ionic_native_in_app_browser__["a" /* InAppBrowser */],
                __WEBPACK_IMPORTED_MODULE_40__ionic_native_call_number__["a" /* CallNumber */],
                __WEBPACK_IMPORTED_MODULE_41__ionic_native_email_composer__["a" /* EmailComposer */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_globalization__["a" /* Globalization */],
                __WEBPACK_IMPORTED_MODULE_43__ionic_native_facebook__["a" /* Facebook */],
                __WEBPACK_IMPORTED_MODULE_44__ionic_native_google_plus__["a" /* GooglePlus */],
                __WEBPACK_IMPORTED_MODULE_45__ionic_native_onesignal__["a" /* OneSignal */],
                { provide: __WEBPACK_IMPORTED_MODULE_8__app_config__["a" /* APP_CONFIG */], useValue: __WEBPACK_IMPORTED_MODULE_8__app_config__["b" /* BaseAppConfig */] },
                { provide: __WEBPACK_IMPORTED_MODULE_2__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["d" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 274:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_device__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_onesignal__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_config__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_auth_credential_models__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_orders_orders__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_mysplash_mysplash__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__node_modules_ngx_translate_core__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_globalization__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_firebase__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_firebase__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};















var MyApp = /** @class */ (function () {
    function MyApp(config, globalization, device, translate, events, alertCtrl, service, platform, statusBar, splashScreen, oneSignal) {
        var _this = this;
        this.config = config;
        this.globalization = globalization;
        this.device = device;
        this.translate = translate;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.service = service;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.oneSignal = oneSignal;
        this.deviceModel = "";
        this.rootPage = __WEBPACK_IMPORTED_MODULE_11__pages_mysplash_mysplash__["a" /* MySplashPage */];
        this.subscriptions = [];
        this.pageCategory = 1;
        this.categoriesAll = new Array();
        var superAuth = "";
        if (config.apiBase && config.apiBase.startsWith('https') && config.consumerKey && config.consumerKey.length && config.consumerSecret && config.consumerSecret.length) {
            superAuth = ("Basic " + btoa(config.consumerKey + ":" + config.consumerSecret));
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].ADMIN_API_KEY, superAuth);
            this.onSuperAuthSetup(superAuth);
        }
        else if (config.apiBase && config.apiBase.startsWith('http:') && config.adminUsername && config.adminUsername.length && config.adminPassword && config.adminPassword.length) {
            var subscription = service.getAuthToken(new __WEBPACK_IMPORTED_MODULE_8__models_auth_credential_models__["a" /* AuthCredential */](config.adminUsername, config.adminPassword)).subscribe(function (data) {
                var authResponse = data;
                superAuth = ("Bearer " + authResponse.token);
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].ADMIN_API_KEY, superAuth);
                _this.onSuperAuthSetup(superAuth);
            }, function (err) {
                console.log('auth setup error');
            });
            this.subscriptions.push(subscription);
        }
        else {
            console.log('auth setup error');
        }
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].USER_KEY));
        this.initializeApp();
        this.listenToLoginEvents();
    }
    MyApp.prototype.onSuperAuthSetup = function (superAuth) {
        console.log('auth setup success: ' + superAuth);
        this.loadCategories();
        this.loadCurrency();
        this.loadPaymentGateways();
        this.loadShippingLines();
    };
    MyApp.prototype.listenToLoginEvents = function () {
        var _this = this;
        this.events.subscribe('user:login', function () {
            _this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].USER_KEY));
        });
    };
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
    MyApp.prototype.loadCurrency = function () {
        var savedCurrency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].CURRENCY));
        if (!savedCurrency) {
            var subscription = this.service.currencies(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
                var currency = data;
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].CURRENCY, JSON.stringify(currency));
                console.log('currency setup success');
            }, function (err) {
                console.log('currency setup error');
            });
            this.subscriptions.push(subscription);
        }
        // let subscription: Subscription = this.service.currencies(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
        // 	let currency: Currency = data;
        // 	window.localStorage.setItem(Constants.CURRENCY, JSON.stringify(currency));
        // 	console.log('currency setup success');
        // }, err => {
        // 	console.log('currency setup error');
        // });
        // this.subscriptions.push(subscription);
    };
    MyApp.prototype.loadShippingLines = function () {
        var subscription = this.service.shippingLines(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            var shippingLines = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].SHIPPING_LINES, JSON.stringify(shippingLines));
            console.log('shippingLines setup success');
        }, function (err) {
            console.log('categories setup error');
        });
        this.subscriptions.push(subscription);
    };
    MyApp.prototype.loadPaymentGateways = function () {
        var subscription = this.service.paymentGateways(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            var paymentGateway = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].PAYMENT_GATEWAYS, JSON.stringify(paymentGateway));
            console.log('payment-gateway setup success');
        }, function (err) {
            console.log('categories setup error');
        });
        this.subscriptions.push(subscription);
    };
    MyApp.prototype.loadCategories = function () {
        var _this = this;
        var subscription = this.service.categories(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.pageCategory)).subscribe(function (data) {
            var categories = data;
            if (categories.length == 0) {
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES, JSON.stringify(_this.categoriesAll));
                console.log('categories setup success');
                _this.events.publish('category:setup');
            }
            else {
                _this.categoriesAll = _this.categoriesAll.concat(categories);
                _this.pageCategory++;
                _this.loadCategories();
            }
        }, function (err) {
            console.log('categories setup error');
        });
        this.subscriptions.push(subscription);
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('en');
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            __WEBPACK_IMPORTED_MODULE_14_firebase___default.a.initializeApp({
                apiKey: _this.config.firebaseConfig.apiKey,
                authDomain: _this.config.firebaseConfig.authDomain,
                databaseURL: _this.config.firebaseConfig.databaseURL,
                projectId: _this.config.firebaseConfig.projectId,
                storageBucket: _this.config.firebaseConfig.storageBucket,
                messagingSenderId: _this.config.firebaseConfig.messagingSenderId
            });
            try {
                if (_this.device.model) {
                    _this.deviceModel = _this.device.model.replace(/\s/g, '').replace(',', '').toLowerCase();
                    // iphone model nos. https://gist.github.com/adamawolf/3048717
                    if (_this.deviceModel.indexOf("iphone103") != -1 || _this.deviceModel.indexOf("iphone106") != -1 || _this.deviceModel.indexOf("iphonex") != -1) {
                        _this.deviceModel = "iphonex";
                    }
                }
            }
            catch (exception) {
                console.log(JSON.stringify(exception));
            }
            if (_this.platform.is('cordova')) {
                _this.initOneSignal();
                // this.initOneSignal();
                console.log("cordova detected");
                _this.globalization.getPreferredLanguage().then(function (result) {
                    console.log("language detected:----" + JSON.stringify(result));
                    var suitableLang = _this.getSuitableLanguage(result.value);
                    console.log(suitableLang);
                    _this.translate.use(suitableLang);
                    _this.setDirectionAccordingly(suitableLang);
                }).catch(function (e) {
                    console.log(e);
                    _this.translate.use('en');
                    _this.setDirectionAccordingly('en');
                });
            }
            else {
                console.log("cordova not detected");
                _this.translate.use('en');
                _this.setDirectionAccordingly('en');
                // this.translate.use('ar');
                // this.setDirectionAccordingly('ar');
            }
        });
    };
    MyApp.prototype.setDirectionAccordingly = function (lang) {
        switch (lang) {
            case 'ar': {
                this.platform.setDir('ltr', false);
                this.platform.setDir('rtl', true);
                break;
            }
            default: {
                this.platform.setDir('rtl', false);
                this.platform.setDir('ltr', true);
                break;
            }
        }
        /*this.translate.use('en');
        this.platform.setDir('ltr', false);
        this.platform.setDir('rtl', true);*/
    };
    MyApp.prototype.initOneSignal = function () {
        var _this = this;
        if (this.config.oneSignalAppId && this.config.oneSignalAppId.length && this.config.oneSignalGPSenderId && this.config.oneSignalGPSenderId.length) {
            this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
            this.oneSignal.handleNotificationReceived().subscribe(function (data) {
                // do something when notification is received
                console.log(data);
            });
            this.oneSignal.handleNotificationOpened().subscribe(function (data) {
                if (data.notification.payload
                    && data.notification.payload.additionalData) {
                    _this.myorderPage();
                }
            });
            this.oneSignal.endInit();
            this.oneSignal.getIds().then(function (id) {
                if (id.userId) {
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].ONESIGNAL_PLAYER_ID, id.userId.toString());
                }
            });
        }
    };
    MyApp.prototype.getSideOfCurLang = function () {
        return this.platform.dir() === 'rtl' ? "right" : "left";
    };
    MyApp.prototype.getSuitableLanguage = function (language) {
        language = language.substring(0, 2).toLowerCase();
        console.log('check for: ' + language);
        return this.config.availableLanguages.some(function (x) { return x.code == language; }) ? language : 'en';
    };
    MyApp.prototype.myorderPage = function () {
        if (this.nav.getActive().name != 'OrdersPage')
            this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_10__pages_orders_orders__["a" /* OrdersPage */]);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/app/app.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Inject */])(__WEBPACK_IMPORTED_MODULE_7__app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_13__ionic_native_globalization__["a" /* Globalization */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_device__["a" /* Device */],
            __WEBPACK_IMPORTED_MODULE_12__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_6__providers_wordpress_client_service__["a" /* WordpressClient */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_onesignal__["a" /* OneSignal */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 341:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CartItem; });
var CartItem = /** @class */ (function () {
    function CartItem() {
    }
    return CartItem;
}());

//# sourceMappingURL=cart-item.models.js.map

/***/ }),

/***/ 342:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderRequest; });
var OrderRequest = /** @class */ (function () {
    function OrderRequest() {
    }
    return OrderRequest;
}());

//# sourceMappingURL=order-request.models.js.map

/***/ }),

/***/ 343:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Address; });
var Address = /** @class */ (function () {
    function Address() {
    }
    return Address;
}());

//# sourceMappingURL=address.models.js.map

/***/ }),

/***/ 35:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_home__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__search_search__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__cart_cart__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__favorites_favorites__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__account_account__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_global__ = __webpack_require__(36);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var TabsPage = /** @class */ (function () {
    function TabsPage(events, global) {
        var _this = this;
        this.events = events;
        this.global = global;
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_2__home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_3__search_search__["a" /* SearchPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_4__cart_cart__["a" /* CartPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_5__favorites_favorites__["a" /* FavoritesPage */];
        this.tab5Root = __WEBPACK_IMPORTED_MODULE_6__account_account__["a" /* AccountPage */];
        this.cartCount = 0;
        events.subscribe('cart:count', function (count) {
            _this.cartCount = count;
        });
    }
    TabsPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.events.subscribe('tab:index', function (index) {
            if (index && index != -1) {
                _this.tabRef.select(index);
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])('tabs'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Tabs */])
    ], TabsPage.prototype, "tabRef", void 0);
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/tabs/tabs.html"*/'<ion-tabs [selectedIndex]="0" #tabs>\n    <ion-tab [root]="tab1Root" tabTitle="" tabIcon="md-list-box" tabsHideOnSubPages="true"></ion-tab>\n    <ion-tab [root]="tab2Root" tabTitle="" tabIcon="md-search" tabsHideOnSubPages="true"></ion-tab>\n    <ion-tab [root]="tab3Root" tabTitle="{{cartCount}}" tabIcon="md-basket" tabsHideOnSubPages="true"></ion-tab>\n    <ion-tab [root]="tab4Root" tabTitle="" tabIcon="md-heart" tabsHideOnSubPages="true"></ion-tab>\n    <ion-tab [root]="tab5Root" tabTitle="" tabIcon="md-person" tabsHideOnSubPages="true"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/tabs/tabs.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_7__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_7__providers_global__["a" /* Global */]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PaymentPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PaymentPage = /** @class */ (function () {
    function PaymentPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    PaymentPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PaymentPage');
    };
    PaymentPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-payment',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/payment/payment.html"*/'<!--\n\n  Generated template for the PaymentPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>{{"payment" | translate}}</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/payment/payment.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], PaymentPage);
    return PaymentPage;
}());

//# sourceMappingURL=payment.js.map

/***/ }),

/***/ 36:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Global; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_cart_item_models__ = __webpack_require__(341);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var Global = /** @class */ (function () {
    function Global() {
    }
    Global.prototype.decrementCartItem = function (pro) {
        this.checkCartItems();
        var decrement = false;
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (pro.id == this.cartItems[i].product_id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            if (this.cartItems[pos].quantity > 1) {
                this.cartItems[pos].quantity = this.cartItems[pos].quantity - 1;
            }
            else {
                this.cartItems.splice(pos, 1);
            }
            decrement = true;
            window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        }
        return decrement;
    };
    Global.prototype.incrementCartItem = function (pro) {
        this.checkCartItems();
        var increment = false;
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (pro.id == this.cartItems[i].product_id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.cartItems[pos].quantity = this.cartItems[pos].quantity + 1;
            increment = true;
            window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        }
        else { }
        return increment;
    };
    Global.prototype.removeCartItem = function (pro) {
        this.checkCartItems();
        var removed = false;
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (pro.id == this.cartItems[i].product_id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.cartItems.splice(pos, 1);
            window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
            removed = true;
        }
        return removed;
    };
    Global.prototype.addCartItem = function (pro) {
        this.checkCartItems();
        var added = false;
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (pro.id == this.cartItems[i].product_id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.cartItems[pos].quantity = this.cartItems[pos].quantity + 1;
        }
        else {
            var cartItem = new __WEBPACK_IMPORTED_MODULE_1__models_cart_item_models__["a" /* CartItem */]();
            cartItem.product = pro;
            cartItem.product_id = pro.id;
            cartItem.quantity = 1;
            this.cartItems.push(cartItem);
            added = true;
        }
        window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        return added;
    };
    Global.prototype.toggleFavorite = function (pro) {
        this.checkFavorites();
        var toggleResult = false;
        var pos = -1;
        for (var i = 0; i < this.favorites.length; i++) {
            if (pro.id == this.favorites[i].id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.favorites.splice(pos, 1);
            window.localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
            console.log('saving remove');
            toggleResult = false;
        }
        else {
            this.favorites.push(pro);
            window.localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
            console.log('saving save');
            toggleResult = true;
        }
        return toggleResult;
    };
    Global.prototype.removeFavorite = function (pro) {
        this.checkFavorites();
        var removed = false;
        var pos = -1;
        for (var i = 0; i < this.favorites.length; i++) {
            if (pro.id == this.favorites[i].id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.favorites.splice(pos, 1);
            window.localStorage.setItem('favoriteProducts', JSON.stringify(this.favorites));
            removed = true;
        }
        return removed;
    };
    Global.prototype.isFavorite = function (pro) {
        this.checkFavorites();
        var fav = false;
        for (var _i = 0, _a = this.favorites; _i < _a.length; _i++) {
            var product = _a[_i];
            if (pro.id == product.id) {
                fav = true;
                break;
            }
        }
        return fav;
    };
    Global.prototype.addInSearchHistory = function (query) {
        this.checkSearchHistory();
        var index = this.searchHistory.indexOf(query);
        if (index == -1) {
            if (this.searchHistory.length == 5) {
                this.searchHistory.splice(0, 1);
            }
            this.searchHistory.push(query);
            window.localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
    };
    Global.prototype.clearCart = function () {
        this.cartItems = new Array();
        window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    };
    Global.prototype.clearSearchHistory = function () {
        this.searchHistory = new Array();
        window.localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    };
    Global.prototype.checkCartItems = function () {
        if (this.cartItems == null) {
            var cartItems = JSON.parse(window.localStorage.getItem('cartItems'));
            if (cartItems != null) {
                this.cartItems = cartItems;
            }
            else {
                this.cartItems = new Array();
            }
        }
    };
    Global.prototype.checkFavorites = function () {
        if (this.favorites == null) {
            var favProducts = JSON.parse(window.localStorage.getItem('favoriteProducts'));
            if (favProducts != null) {
                this.favorites = favProducts;
            }
            else {
                this.favorites = new Array();
            }
        }
    };
    Global.prototype.checkSearchHistory = function () {
        if (this.searchHistory == null) {
            var history_1 = JSON.parse(window.localStorage.getItem('searchHistory'));
            if (history_1 != null) {
                this.searchHistory = history_1;
            }
            else {
                this.searchHistory = new Array();
            }
        }
    };
    Global.prototype.getSearchHistory = function () {
        this.checkSearchHistory();
        return this.searchHistory;
    };
    Global.prototype.getFavorites = function () {
        this.checkFavorites();
        return this.favorites;
    };
    Global.prototype.getCartItems = function () {
        this.checkCartItems();
        return this.cartItems;
    };
    Global.prototype.refreshFavorites = function () {
        var favProducts = JSON.parse(window.localStorage.getItem('favoriteProducts'));
        if (favProducts != null) {
            this.favorites = favProducts;
        }
        else {
            this.favorites = new Array();
        }
    };
    Global.prototype.refreshCartItems = function () {
        var cartItems = JSON.parse(window.localStorage.getItem('cartItems'));
        if (cartItems != null) {
            this.cartItems = cartItems;
        }
        else {
            this.cartItems = new Array();
        }
    };
    Global = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], Global);
    return Global;
}());

//# sourceMappingURL=global.js.map

/***/ }),

/***/ 41:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APP_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BaseAppConfig; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);

var APP_CONFIG = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* InjectionToken */]("app.config");
var BaseAppConfig = {
    appName: "Greek",
    apiBase: "http://www.greekdelivery.in/admin/wp-json/",
    perPage: "5",
    consumerKey: "",
    consumerSecret: "",
    adminUsername: "greekstoreadmin",
    adminPassword: "greekdelivery@123",
    oneSignalAppId: "1eaf0b81-a060-4702-8b8e-2dd3e1884f35",
    oneSignalGPSenderId: "104708265393",
    paypalSandbox: "",
    paypalProduction: "",
    payuSalt: "",
    payuKey: "",
    availableLanguages: [{
            code: 'en',
            name: 'English'
        }, {
            code: 'ar',
            name: 'Arabic'
        }, {
            code: 'es',
            name: 'Spanish'
        }, {
            code: 'pt',
            name: 'Portuguese'
        }],
    firebaseConfig: {
        webApplicationId: "1065673085835-dcligpb01dujnahtasqs3shc14dljgj0.apps.googleusercontent.com",
        apiKey: "AIzaSyDFDQYtsQ6cVxkg-XMt1K_uk8oLJv0ej3Q",
        authDomain: "greek-delivery.firebaseapp.com",
        databaseURL: "https://greek-delivery.firebaseio.com",
        projectId: "greek-delivery",
        storageBucket: "greek-delivery.appspot.com",
        messagingSenderId: "1065673085835"
    }
};
//# sourceMappingURL=app.config.js.map

/***/ }),

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthCredential; });
var AuthCredential = /** @class */ (function () {
    function AuthCredential(username, password) {
        this.username = username;
        this.password = password;
    }
    return AuthCredential;
}());

//# sourceMappingURL=auth-credential.models.js.map

/***/ }),

/***/ 63:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ItemsinfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_global__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the ItemsinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ItemsinfoPage = /** @class */ (function () {
    function ItemsinfoPage(service, events, navCtrl, toastCtrl, loadingCtrl, global, navParams, translateService) {
        this.service = service;
        this.events = events;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.global = global;
        this.navParams = navParams;
        this.translateService = translateService;
        this.loadingShown = false;
        this.quantity = 0;
        this.cartTotal = 0;
        this.cartSize = 0;
        this.productVariations = new Array();
        this.subscriptions = [];
        this.cartItems = new Array();
        this.pro = this.navParams.get('pro');
        if (this.pro) {
            this.pro.favorite = global.isFavorite(this.pro);
            this.cartItems = global.getCartItems();
            for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
                var ci = _a[_i];
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
        }
        else {
            navCtrl.pop();
        }
    }
    ItemsinfoPage.prototype.loadVariations = function () {
        var _this = this;
        this.translateService.get('no_sign_in').subscribe(function (value) {
            _this.presentLoading(value);
        });
        var subscription = this.service.productVariations(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.pro.id).subscribe(function (data) {
            var variations = data;
            for (var _i = 0, variations_1 = variations; _i < variations_1.length; _i++) {
                var vari = variations_1[_i];
                var variAttris = '';
                for (var i = 0; i < vari.attributes.length; i++) {
                    var attri = vari.attributes[i].name + ' ' + vari.attributes[i].option + (i < vari.attributes.length - 1 ? ', ' : '');
                    variAttris = variAttris + attri;
                }
                vari.name = _this.pro.name + ' - ' + variAttris;
                vari.type = 'variable';
                vari.images = new Array();
                vari.images.push(vari.image);
                vari.categories = _this.pro.categories;
                vari.quantity = 0;
                for (var _a = 0, _b = _this.cartItems; _a < _b.length; _a++) {
                    var ci = _b[_a];
                    if (vari.id == ci.product_id) {
                        vari.quantity = ci.quantity;
                        break;
                    }
                }
                if (!_this.currencyText) {
                    var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].CURRENCY));
                    if (currency) {
                        _this.currencyText = currency.value;
                        var iconText = currency.options[currency.value];
                        _this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
                    }
                }
                if (!vari.sale_price) {
                    vari.sale_price = vari.regular_price;
                }
                if (_this.currencyIcon) {
                    vari.regular_price_html = _this.currencyIcon + ' ' + vari.regular_price;
                    vari.sale_price_html = _this.currencyIcon + ' ' + vari.sale_price;
                }
                else if (_this.currencyText) {
                    vari.regular_price_html = _this.currencyText + ' ' + vari.regular_price;
                    vari.sale_price_html = _this.currencyText + ' ' + vari.sale_price;
                }
            }
            _this.productVariations = variations;
            _this.dismissLoading();
        }, function (err) {
        });
        this.subscriptions.push(subscription);
    };
    ItemsinfoPage.prototype.toggleFavorite = function () {
        this.favorite = this.global.toggleFavorite(this.pro);
    };
    ItemsinfoPage.prototype.decrement = function () {
        var decremented = this.global.decrementCartItem(this.pro);
        if (decremented) {
            this.quantity = this.quantity - 1;
            this.calculateTotal();
        }
    };
    ItemsinfoPage.prototype.increment = function () {
        this.global.addCartItem(this.pro);
        this.quantity = this.quantity + 1;
        this.calculateTotal();
    };
    ItemsinfoPage.prototype.decrementItem = function (pro) {
        var decremented = this.global.decrementCartItem(pro);
        if (decremented) {
            pro.quantity = pro.quantity - 1;
            this.calculateTotal();
        }
    };
    ItemsinfoPage.prototype.incrementItem = function (pro) {
        this.global.addCartItem(pro);
        pro.quantity = pro.quantity + 1;
        this.calculateTotal();
    };
    ItemsinfoPage.prototype.calculateTotal = function () {
        window.localStorage.setItem('changed', 'changed');
        this.cartItems = this.global.getCartItems();
        var sum = 0;
        this.cartSize = this.cartItems.length;
        for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
            var item = _a[_i];
            sum = sum + Number(item.product.sale_price) * item.quantity;
        }
        this.cartTotal = sum;
    };
    ItemsinfoPage.prototype.goToCart = function () {
        this.navCtrl.pop();
        this.events.publish('tab:index', 2);
    };
    ItemsinfoPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    ItemsinfoPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    ItemsinfoPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    ItemsinfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-itemsinfo',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/itemsinfo/itemsinfo.html"*/'<ion-header class="">\n\n    <ion-navbar>\n\n        <ion-title text-start>\n\n            <ion-icon *ngIf="!favorite" name="md-heart" item-end (click)="toggleFavorite()"></ion-icon>\n\n            <ion-icon class="text-red" *ngIf="favorite" name="md-heart" item-end (click)="toggleFavorite()"></ion-icon>\n\n        </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content class="no-scroll" >\n\n    <div text-center style="margin-top: 44px">\n\n        <img *ngIf="pro.images && pro.images.length" style="max-height: 20vh" data-src="{{pro.images[0].src}}">\n\n        <img *ngIf="pro.images == null || pro.images.length == 0" style="max-height: 30vh" src="assets/imgs/img_3.png">\n\n    </div>\n\n    <div class="text" padding>\n\n        <h1>{{pro.name}}\n\n        </h1>\n\n        <ion-row *ngIf="pro.type == \'simple\'" class="add-remove">\n\n            <ion-col col-6 class="text-green">\n\n                <p [innerHTML]="pro.price_html"></p>\n\n            </ion-col>\n\n            <ion-col col-6 >\n\n                <ion-icon name="md-remove-circle" class="text-green" (click)="decrement()"></ion-icon>\n\n                <span>{{quantity}}</span>\n\n                <ion-icon name="md-add-circle" class="text-green" (click)="increment()"></ion-icon>\n\n            </ion-col>\n\n        </ion-row>\n\n        <!-- Variations start -->\n\n        <ion-list *ngIf="productVariations && productVariations.length" no-lince>\n\n            <ion-item *ngFor="let item of productVariations" class="your-items">\n\n                <ion-avatar item-start>\n\n                        <p [innerHTML]="pro.description"></p>\n\n                    <img *ngIf="!pro.description" src="assets/imgs/img_3.png">\n\n                </ion-avatar>\n\n                <h2 style="white-space: initial;">{{item.name}}</h2>\n\n                \n\n                <ion-row>\n\n                    <ion-col col-6>\n\n                        <ion-icon name="md-remove-circle" class="text-green" (click)="decrementItem(item)"></ion-icon>\n\n                        <span>{{item.quantity}}</span>\n\n                        <ion-icon name="md-add-circle" class="text-green" (click)="incrementItem(item)"></ion-icon>\n\n                    </ion-col>\n\n                    <ion-col col-6 class="text-green" text-right>\n\n                        <p style="text-decoration: line-through;" [innerHTML]="item.regular_price_html"></p>\n\n                        <p style="color: #33bcf7;"  [innerHTML]="item.sale_price_html"></p>\n\n                    </ion-col>\n\n                </ion-row>\n\n            </ion-item>\n\n        </ion-list>\n\n       \n\n        <!-- Variations end -->\n\n     \n\n    </div>\n\n\n\n    <div class="fixed-bottom">\n\n        <button ion-button full class="btn btn-green" (click)="goToCart()">\n\n          <span item-start>{{cartSize}} {{\'items\' | translate}} | {{cartTotal}}</span>\n\n          <strong item-end> {{\'items\' | translate}}\n\n              <ion-icon name="md-basket"></ion-icon>\n\n          </strong>\n\n        </button>\n\n    </div>\n\n</ion-content>\n\n'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/itemsinfo/itemsinfo.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2__providers_global__["a" /* Global */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */], __WEBPACK_IMPORTED_MODULE_5__node_modules_ngx_translate_core__["c" /* TranslateService */]])
    ], ItemsinfoPage);
    return ItemsinfoPage;
}());

//# sourceMappingURL=itemsinfo.js.map

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CartPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__conaddress_conaddress__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__code_code__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var CartPage = /** @class */ (function () {
    function CartPage(modalCtrl, translateService, events, alertCtrl, platform, global, navCtrl, toastCtrl) {
        var _this = this;
        this.modalCtrl = modalCtrl;
        this.translateService = translateService;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        this.global = global;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.cartItems = new Array();
        this.discount = 0;
        this.couponAmount = '0';
        this.total = 0;
        this.total_items = 0;
        this.total_items_html = '0';
        this.total_html = '0';
        this.currencyIcon = '';
        this.currencyText = '';
        {
            platform.ready().then(function () {
                platform.registerBackButtonAction(function () {
                    _this.makeExitAlert();
                });
            });
        }
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.indexOf('(') + 1, iconText.length - 1);
        }
        this.discount_html = this.currencyIcon + this.discount;
        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
    }
    CartPage.prototype.ionViewDidEnter = function () {
        this.global.refreshCartItems();
        this.cartItems = this.global.getCartItems();
        this.calculateTotal();
    };
    CartPage.prototype.removeItem = function (product) {
        this.global.removeCartItem(product);
        this.cartItems = this.global.getCartItems();
        this.calculateTotal();
    };
    CartPage.prototype.decrementItem = function (product) {
        var decremented = this.global.decrementCartItem(product);
        this.cartItems = this.global.getCartItems();
        this.calculateTotal();
    };
    CartPage.prototype.incrementItem = function (product) {
        var incremented = this.global.incrementCartItem(product);
        if (incremented) {
            this.total = this.total + Number(product.sale_price);
            window.localStorage.setItem('changed', 'changed');
        }
        this.cartItems = this.global.getCartItems();
        this.calculateTotal();
    };
    CartPage.prototype.makeExitAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: '',
            message: 'Do you want to close the app?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel'
                }, {
                    text: 'Close App',
                    handler: function () {
                        _this.platform.exitApp(); // Close this application
                    }
                }]
        });
        alert.present();
    };
    CartPage.prototype.calculateTotal = function () {
        window.localStorage.setItem('changed', 'changed');
        var sum = 0;
        for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
            var item = _a[_i];
            sum = sum + Number(item.product.sale_price) * item.quantity;
        }
        this.total_items = sum;
        this.total = (sum - (this.coupon ? this.coupon.discount_type == 'percent' ? (sum * Number(this.coupon.amount) / 100) : Number(this.coupon.amount) : 0));
        this.total_items_html = this.currencyIcon + ' ' + this.total_items;
        this.total_html = this.currencyIcon + ' ' + this.total;
        this.events.publish('cart:count', this.cartItems.length);
        if (!this.cartItems || !this.cartItems.length) {
            this.checkoutText = 'Cart is empty';
        }
        else {
            this.checkoutText = 'Proceed to confirm order';
        }
    };
    CartPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    CartPage.prototype.proceedCheckout = function () {
        if (this.cartItems != null && this.cartItems.length > 0) {
            var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].USER_KEY));
            if (user != null) {
                if (!this.coupon) {
                    window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
                }
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__conaddress_conaddress__["a" /* ConaddressPage */], { cart: this.cartItems, totalItems: this.total_items, total: this.total });
            }
            else {
                this.events.publish('tab:index', 0);
                this.events.publish('go:to', 'auth');
            }
        }
    };
    CartPage.prototype.codePage = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__code_code__["a" /* CodePage */]);
        modal.onDidDismiss(function () {
            var coupon = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_COUPON));
            if (coupon) {
                if (coupon.discount_type == 'fixed_product') {
                    var allowed = false;
                    for (var _i = 0, _a = coupon.product_ids; _i < _a.length; _i++) {
                        var itemCA = _a[_i];
                        for (var _b = 0, _c = _this.cartItems; _b < _c.length; _b++) {
                            var item = _c[_b];
                            if (itemCA == Number(item.product_id)) {
                                allowed = true;
                                break;
                            }
                        }
                        if (allowed) {
                            break;
                        }
                    }
                    if (allowed) {
                        _this.coupon = coupon;
                        _this.couponAmount = _this.currencyIcon + ' ' + _this.coupon.amount + (_this.coupon.discount_type == 'percent' ? '%' : '');
                        _this.calculateTotal();
                    }
                }
                else {
                    _this.coupon = coupon;
                    _this.couponAmount = _this.currencyIcon + ' ' + _this.coupon.amount + (_this.coupon.discount_type == 'percent' ? '%' : '');
                    _this.calculateTotal();
                }
            }
        });
        modal.present();
    };
    CartPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-cart',template:/*ion-inline-start:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/cart/cart.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>{{\'cart_title\' | translate}}</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="bg-light">\n\n  <div *ngIf="!cartItems || !cartItems.length" class="empty">\n\n    <div>\n\n      <img src="assets/imgs/empty.png">\n\n      <p>{{\'no_items\' | translate}}!</p>\n\n    </div>\n\n  </div>\n\n  <ion-list *ngIf="cartItems && cartItems.length" no-lince>\n\n    <ion-item *ngFor="let item of cartItems">\n\n      <ion-avatar item-start>\n\n        <img *ngIf="item.product.images && item.product.images.length" data-src="{{item.product.images[0].src}}">\n\n        <img *ngIf="item.product.images == null || item.product.images.length == 0" src="assets/imgs/img_2.png">\n\n      </ion-avatar>\n\n      <h2>{{item.product.name}}</h2>\n\n      <p>{{item.product.categories[0].name}}</p>\n\n      <ion-row>\n\n        <ion-col col-6>\n\n          <ion-icon name="md-remove-circle" class="text-green" (click)="decrementItem(item.product)"></ion-icon>\n\n          <span>{{item.quantity}}</span>\n\n          <ion-icon name="md-add-circle" class="text-green" (click)="incrementItem(item.product)"></ion-icon>\n\n        </ion-col>\n\n        <ion-col col-6 class="text-green" text-right>\n\n          <p [innerHTML]="item.product.sale_price_html"></p>\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-item>\n\n  </ion-list>\n\n  <ion-card class="fixed-bottom">\n\n    <p>{{\'total\' | translate}}\n\n      <strong [innerHTML]="total_items_html"></strong>\n\n    </p>\n\n    <p>{{\'dlvr_charge\' | translate}}\n\n      <strong [innerHTML]="discount_html"></strong>\n\n    </p>\n\n    <p *ngIf="!coupon" class="text-green" (click)="codePage()">\n\n      {{\'have_promo\' | translate}}?\n\n    </p>\n\n    <p *ngIf="coupon">{{\'coupon\' | translate}}({{coupon.code}}) {{\'have_promo\' | translate}}\n\n      <strong [innerHTML]="couponAmount"></strong>\n\n      <ion-icon name="md-close" class="cross" (click)="removeCoupon()"></ion-icon>\n\n    </p>\n\n    <button ion-button full class="btn btn-green" (click)="proceedCheckout()">\n\n      <span item-start>{{checkoutText | translate}}</span>\n\n      <span item-end>\n\n        <strong [innerHTML]="total_html"></strong>\n\n      </span>\n\n    </button>\n\n  </ion-card>\n\n</ion-content>'/*ion-inline-end:"/Users/vinayaknair/Desktop/greeksourcecode/Greek-Delivery/Greek/src/pages/cart/cart.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
    ], CartPage);
    return CartPage;
}());

//# sourceMappingURL=cart.js.map

/***/ }),

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterRequest; });
var RegisterRequest = /** @class */ (function () {
    function RegisterRequest(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.roles = 'contributor';
        this.first_name = '';
        this.last_name = '';
    }
    return RegisterRequest;
}());

//# sourceMappingURL=register-request.models.js.map

/***/ })

},[259]);
//# sourceMappingURL=main.js.map