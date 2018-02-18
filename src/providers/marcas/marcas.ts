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
       "name": "Burt Bear",
       "profilePic": "assets/img/speakers/bear.jpg",
       "about": "Burt is a Bear."
     },
     {
       "name": "Charlie Cheetah",
       "profilePic": "assets/img/speakers/cheetah.jpg",
       "about": "Charlie is a Cheetah."
     },
     {
       "name": "Donald Duck",
       "profilePic": "assets/img/speakers/duck.jpg",
       "about": "Donald is a Duck."
     },
     {
       "name": "Eva Eagle",
       "profilePic": "assets/img/speakers/eagle.jpg",
       "about": "Eva is an Eagle."
     },
     {
       "name": "Ellie Elephant",
       "profilePic": "assets/img/speakers/elephant.jpg",
       "about": "Ellie is an Elephant."
     },
     {
       "name": "Molly Mouse",
       "profilePic": "assets/img/speakers/mouse.jpg",
       "about": "Molly is a Mouse."
     },
     {
       "name": "Paul Puppy",
       "profilePic": "assets/img/speakers/puppy.jpg",
       "about": "Paul is a Puppy."
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
