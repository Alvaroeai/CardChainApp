import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';

import { Marca } from '../../models/marca';
import { Marcas } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  currentItems: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public marcas: Marcas, public items: Items, public modalCtrl: ModalController) {
    this.currentItems = this.marcas.query();
  }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    this.currentItems = this.marcas.query({
      name: val
    });
  }

  /**
   * Navigate to the detail page for this item.
   */

  openItem(marca: Marca) {
    console.log(marca);

    this.viewCtrl.dismiss('addModal');
    let addModal = this.modalCtrl.create('ItemCreatePage', {
      marca: marca
    });
    addModal.onDidDismiss(item => {
      console.log('item'+item)
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();

    // this.navCtrl.push('ItemCreatePage', {
    //   marca: marca
    // });
  }

}
