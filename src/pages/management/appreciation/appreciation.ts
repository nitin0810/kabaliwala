import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-appreciation',
  templateUrl: 'appreciation.html',
})
export class AppreciationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    ('ionViewDidLoad AppreciationPage');
  }

}
