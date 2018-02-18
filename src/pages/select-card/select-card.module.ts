import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectCardPage } from './select-card';

@NgModule({
  declarations: [
    SelectCardPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectCardPage),
  ],
})
export class SelectCardPageModule {}
