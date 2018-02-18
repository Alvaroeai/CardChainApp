import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

//import JsBarcode from 'jsbarcode';

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
//  @ViewChild('barcode') barcode: ElementRef;

  constructor(private _sanitizer: DomSanitizer, public navCtrl: NavController, navParams: NavParams, items: Items) {
    this.item = navParams.get('item') || items.defaultItem;
    console.log(this.color);
    let color = this.item.color;
  }


getBackground(color) {
    return this._sanitizer.bypassSecurityTrustStyle(`background-color:`+color);
}

  ionViewDidLoad(){
  //   JsBarcode(this.barcode.nativeElement, '12345');
    }

}
