import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Marca } from '../../models/marca';

const STORAGE_KEY = 'Marcas';
/*
  Generated class for the MarcasProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Marcas {

  marcas: Marca[] = [];

  constructor(private storage: Storage) {
    console.log('Hello MarcasProvider Provider');
    //let marcas = [];

    let marcas = [
     {
       "name": "Mercadona",
       "img": "assets/img/marcas/mercadona.png",
       "about": "",
       "type": "barcode",
       "color": "green",
       "code": "",
       "format": ""
     },
     {
       "name": "Carrefour",
       "img": "assets/img/marcas/carrefour.png",
       "about": "",
       "type": "barcode",
       "color": "blue",
       "code": "",
       "format": ""
     },
     {
       "name": "Mutua Madrileña",
       "img": "assets/img/marcas/mutua.png",
       "about": "",
       "type": "barcode",
       "color": "blue",
       "code": "",
       "format": ""
     },
     {
       "name": "Galp",
       "img": "assets/img/marcas/galp.png",
       "about": "",
       "type": "ocr",
       "color": "orange",
       "code": "",
       "format": ""
     },
     {
       "name": "Prink",
       "img": "assets/img/marcas/prink.png",
       "about": "",
       "type": "barcode",
       "color": "red",
       "code": "",
       "format": ""
     },
     {
       "name": "QR Code",
       "img": "assets/img/marcas/qr.png",
       "about": "",
       "type": "barcode",
       "color": "red",
       "code": "",
       "format": ""
     },
     {
       "name": "Barcode",
       "img": "assets/img/marcas/barcode.png",
       "about": "",
       "type": "barcode",
       "color": "red",
       "code": "",
       "format": ""
     },{
       "name": "OCR Code",
       "img": "assets/img/marcas/ocr.png",
       "about": "",
       "type": "ocr",
       "color": "red",
       "code": "",
       "format": ""
     }
   ];

   for (let marca of marcas) {
     this.marcas.push(new Marca(marca));
   }

    // this.storage.get(STORAGE_KEY).then((val) => {
    //   if(val==null){
    //   return null;
    //   } else {
    //      this.marcas.push(new Item(val));
    //   }
    //    for (let item of val) {
    //      this.marcas.push(new Item(item));
    //    }
    // });
  }
  query(params?: any) {
    if (!params) {
      return this.marcas;
    }

    return this.marcas.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  add(marca: Marca) {
    this.marcas.push(marca);
    this.storage.set(STORAGE_KEY,this.marcas);
  }

  delete(marca: Marca) {
    this.marcas.splice(this.marcas.indexOf(marca), 1);
    this.storage.set(STORAGE_KEY,this.marcas);
  }

}
