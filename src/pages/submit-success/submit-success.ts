import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SubmitSuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-submit-success',
  templateUrl: 'submit-success.html',
})
export class SubmitSuccessPage {

  timeOutId: number;
  music: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  onBack() {
    clearTimeout(this.timeOutId);
    this.navCtrl.pop();
  }
  
  ngOnInit(){
    this.playSound();
  }



  ionViewDidLoad() {
    /**
     * REMOVE THE PAGE BELOW THE CURRENT PAGE IN THE PAGE STACK
     * THIS IS DONE IN ORDER TO VIEW THE MAIN PAGE DIRECTLY AND NOT THE NEW-FORM PAGE
     */
    const prevView: ViewController = this.navCtrl.getPrevious();
    this.navCtrl.removeView(prevView);

    this.timeOutId = setTimeout(() => {
      this.navCtrl.pop();
    }, 5000);
  }

  playSound(){
    this.music = document.getElementById("music");
    if(this.music){
      this.music.play();
    }

  }

}
