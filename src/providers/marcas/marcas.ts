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

    let marcas = [{
      "name": "Otra tarjeta",
      "img": "assets/img/cards/mercadona.png",
      "about": "",
      "type": "barcode",
      "color": "green",
      "code": "",
      "format": "",
      "category":"",
      "code_image":"",
      "image_front":"assets/img/cards/front.png",
      "image_back":"assets/img/cards/back.png",
      "custom":false,
    },
     {
       "name": "Mercadona",
       "img": "assets/img/cards/mercadona.png",
       "about": "",
       "type": "barcode",
       "color": "green",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "Carrefour",
       "img": "assets/img/cards/carrefour.png",
       "about": "",
       "type": "barcode",
       "color": "blue",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "Dia",
       "img": "assets/img/cards/dia.png",
       "about": "",
       "type": "barcode",
       "color": "red",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "Hiper Usera",
       "img": "assets/img/cards/hiperusera.png",
       "about": "",
       "type": "barcode",
       "color": "green",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "Mutua Madrileña",
       "img": "assets/img/cards/mutuamadrilena.png",
       "about": "",
       "type": "barcode",
       "color": "blue",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "Galp",
       "img": "assets/img/cards/galp.png",
       "about": "",
       "type": "barcode",
       "color": "orange",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "Cepsa",
       "img": "assets/img/cards/cepsa.png",
       "about": "",
       "type": "barcode",
       "color": "red",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "BP",
       "img": "assets/img/cards/bp.png",
       "about": "",
       "type": "barcode",
       "color": "green",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "Ikea",
       "img": "assets/img/cards/IKEA.png",
       "about": "",
       "type": "barcode",
       "color": "orange",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "Travel Club",
       "img": "assets/img/cards/travelclub.png",
       "about": "",
       "type": "barcode",
       "color": "blue",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "QR Code",
       "img": "assets/img/cards/transparent.png",
       "about": "",
       "type": "barcode",
       "color": "red",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },
     {
       "name": "Barcode",
       "img": "assets/img/cards/transparent.png",
       "about": "",
       "type": "barcode",
       "color": "red",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
     },{
       "name": "OCR Code",
       "img": "assets/img/cards/transparent.png",
       "about": "",
       "type": "barcode",
       "color": "red",
       "code": "",
       "format": "",
       "category":"",
       "code_image":"",
       "image_front":"assets/img/cards/front.png",
       "image_back":"assets/img/cards/back.png",
       "custom":true,
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
