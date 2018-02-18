import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CardIO } from '@ionic-native/card-io';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private cardIO: CardIO, private qrScanner: QRScanner, private barcodeScanner: BarcodeScanner) {
  }

  ionViewDidLoad() {
    console.log('Hello CreditCardScan Page');
  }

  //BARCODE SCANNER
  ScanBarcode(){
    this.barcodeScanner.scan().then((barcodeData) => {
    // Success! Barcode data is here
    console.log('Success! Barcode data is here'+ barcodeData);
    }, (err) => {
      // An error occurred
      console.log('An error occurred'+ err);
    });
  }

  //QR SCANNER
  ScanQR(){
  // Optionally request the permission early
  this.qrScanner.prepare()
  .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted


       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         console.log('Scanned something', text);

         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });

       // show camera preview
       this.qrScanner.show();

       // wait for user to scan something, then the observable callback will be called

     } else if (status.denied) {
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there
     } else {
       // permission was denied, but not permanently. You can ask for permission again at a later time.
     }
  })
  .catch((e: any) => console.log('Error is', e));
  }

  cardImage = 'assets/imgs/credit_card.png';

  card = {
    cardType: '',
    cardNumber: '',
    redactedCardNumber: '',
    expiryMonth: null,
    expiryYear: null,
    cvv: '',
    postalCode: ''
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
              expiryMonth,
              expiryYear,
              cvv,
              postalCode
            } = response;

            this.card = {
              cardType,
              cardNumber,
              redactedCardNumber,
              expiryMonth,
              expiryYear,
              cvv,
              postalCode
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
