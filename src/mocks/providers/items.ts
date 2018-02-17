import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Item } from '../../models/item';

const STORAGE_KEY = 'CardChain';

@Injectable()
export class Items {

items: Item[] = [];

defaultItem: any = {
  "name": "Burt Bear",
  "profilePic": "assets/img/speakers/bear.jpg",
  "about": "Burt is a Bear.",
};


constructor(private storage: Storage) {
    let items = [];
    this.storage.get(STORAGE_KEY).then((val) => {
       this.items.push(val);
    });

    for (let item of items) {
      this.items.push(new Item(item));
    }
}

  query(params?: any) {
    if (!params) {
      return this.items;
    }

    return this.items.filter((item) => {
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

  add(item: Item) {
     this.getAll().then((result) => {
          if (result) {
            this.items.push(item);
            this.storage.set(STORAGE_KEY, result);
          } else {
            this.storage.set(STORAGE_KEY, [item]);
          }
        });
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  getAll() {
    return this.storage.get(STORAGE_KEY);
  }

}
