import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import JsBarcode from 'jsbarcode';

import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
  template: '<svg #barcode id="barcode"></svg>'
})
export class ItemDetailPage {
  item: any;
  public picture;
  @ViewChild('barcode') barcode: ElementRef;

  constructor(public navCtrl: NavController, navParams: NavParams, items: Items) {
    this.item = navParams.get('item') || items.defaultItem;

  }

  ionViewDidLoad(){
     JsBarcode(this.barcode.nativeElement, '12345');
    }

}
