import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

import JsBarcode from 'jsbarcode';

import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  public picture;
//  public color: string = 'blue-yellow';
  public color: string = 'custom';
  @ViewChild('barcode') barcode: ElementRef;
scanData : {};
encodeData : string ;
encodedData : {} ;
options :BarcodeScannerOptions;
  constructor(private _sanitizer: DomSanitizer, public navCtrl: NavController, navParams: NavParams, items: Items, private qrScanner: QRScanner, private barcodeScanner: BarcodeScanner) {
    this.item = navParams.get('item') || items.defaultItem;
    console.log(this.color);
    let color = this.item.color;

  }

  ionViewDidLoad(){
   JsBarcode(this.barcode.nativeElement, this.item.code.text);
  //this.encodeText();
    }


    encodeText(){
   this.barcodeScanner.encode(
   this.barcodeScanner.Encode.TEXT_TYPE,this.item.code).then((encodedData) => {

       alert(encodedData);
       this.encodedData = encodedData;

   }, (err) => {
       console.log("Error occured : " + err);
     });

    }




}
