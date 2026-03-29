import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SauvegarderPageRoutingModule } from './sauvegarder-routing.module';

import { SauvegarderPage } from './sauvegarder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SauvegarderPageRoutingModule,
  ],
  declarations: [SauvegarderPage],
})
export class SauvegarderPageModule {}
