import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,Slides } from 'ionic-angular';
import { SigninPage } from '../signin/signin';
import { HomePage } from '../home/home';
import { Constants } from '../../models/constants.models';
import { Category } from '../../models/category.models';
import { TabsPage } from '../tabs/tabs';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'page-walkthough',
  templateUrl: 'walkthough.html',
})
export class WalkthoughPage {
  @ViewChild(Slides) slider: Slides;

  constructor(private events: Events, public navCtrl: NavController, 
    public translateService: TranslateService, public navParams: NavParams) {
  }

  ngAfterViewInit() {
    this.slider.freeMode = true;
  }

  ionViewDidEnter() {
    if (this.translateService.currentLang == 'ar') { 
      this.slider._rtl = true 
    }
    console.log("ionViewDidEnter");
  }

  finish() {
    // if (this.translate.currentLang == 'ar') { 
    //   this.slider._rtl = true 
    // }
    window.localStorage.setItem('wt', 'shown');
    this.navCtrl.setRoot(TabsPage);
  }

}
