import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface FirebaseConfig {
  apiKey: string,
  authDomain: string,
  databaseURL: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  webApplicationId: string
}

export interface AppConfig {
	appName: string;
	apiBase: string;
	perPage: string;
	consumerKey: string;
	consumerSecret: string;
	adminUsername: string;
	adminPassword: string;
	oneSignalAppId: string,
	oneSignalGPSenderId: string,
	paypalSandbox: string;
	paypalProduction: string;
	payuSalt: string;
	payuKey: string;
  availableLanguages: Array<any>;
  firebaseConfig: FirebaseConfig;
}

export const BaseAppConfig: AppConfig = {
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
    webApplicationId: "476477636599-9s4vhej2tok73k70aeali8jb91045fdl.apps.googleusercontent.com",
    apiKey: "AIzaSyDONlq7cxRN2lLv-iyfLA733cbaybeVJqY",
    authDomain: "greek-74b58.firebaseapp.com",
    databaseURL: "https://greek-74b58.firebaseio.com",
    projectId: "greek-74b58",
    storageBucket: "greek-74b58.appspot.com",
    messagingSenderId: "476477636599"
  }
};