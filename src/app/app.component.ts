import { Component, ViewChild } from '@angular/core';
import { Platform, Events, App, AlertController, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserSessionManage } from '../Classes/user-session-manage';


import { AuthService } from '../providers/auth.service';
import { NetworkService } from '../providers/network.service';
import { CustomService } from '../providers/custom.service';
import { PushMessageService } from '../providers/push-message.service';

@Component({
  templateUrl: 'app.html'
})


export class MyApp extends UserSessionManage {

  @ViewChild(Nav) nav: Nav;
  activePage: any;
  defaultUserImage: string = "assets/imgs/user.png";

  constructor(
    public events: Events,
    public appCtrl: App,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public networkService: NetworkService,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public menu: MenuController,
    private customSercvice: CustomService,
    public pushMsgService:PushMessageService
  ) {
    super(events, appCtrl, authService, alertCtrl, networkService, menu, customSercvice,pushMsgService);

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page: any) {

    /**Handle the case when user pic is clicked */
    if (!page) {
      this.activePage = "";
      this.menu.close();
      // this.nav.setRoot("AccountPage");
      return;
    }


    this.activePage = page.component;
    this.menu.close();
    this.nav.setRoot(page.component);

  }

 
}

