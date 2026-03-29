import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccueilDeveloppeurPageRoutingModule } from './accueil-developpeur-routing.module';

import { AccueilDeveloppeurPage } from './accueil-developpeur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccueilDeveloppeurPageRoutingModule,
  ],
  declarations: [AccueilDeveloppeurPage],
})
export class AccueilDeveloppeurPageModule {}
