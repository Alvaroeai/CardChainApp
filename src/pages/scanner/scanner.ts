import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CardIO } from '@ionic-native/card-io';

/**
 * Generated class for the ScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html',
})
export class ScannerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private cardIO: CardIO) {
  }


  ionViewDidLoad() {
    console.log('Hello CreditCardScan Page');
  }

  cardImage = 'assets/img/misc/credit-card.png';

  card = {
    cardType: '',
    cardNumber: '',
    redactedCardNumber: '',
  //  expiryMonth: null,
  //  expiryYear: null,
  //  cvv: '',
  //  postalCode: ''
  };

  scanCard() {
    this.cardIO.canScan()
      .then(
      (res: boolean) => {
        if (res) {
          const options = {
            scanExpiry: true,
            hideCardIOLogo: true,
            scanInstructions: 'Por favor coloque su tarjeta dentro del marco',
            keepApplicationTheme: true,
            requireCCV: false,
            requireExpiry: false,
            requirePostalCode: false
          };
          this.cardIO.scan(options).then(response => {
            console.log('Scan complete');

            const {
              cardType,
              cardNumber,
              redactedCardNumber,
              //expiryMonth,
              //expiryYear,
              //cvv,
              //postalCode
            } = response;

            this.card = {
              cardType,
              cardNumber,
              redactedCardNumber,
            //  expiryMonth,
            //  expiryYear,
            //  cvv,
            //  postalCode
            };
          });
        }
      });
  }

  // Just to animate the fab
  fabGone = false;
  ionViewWillEnter() {
    this.fabGone = false;
  }

  ionViewWillLeave() {
    this.fabGone = true;
  }

}
