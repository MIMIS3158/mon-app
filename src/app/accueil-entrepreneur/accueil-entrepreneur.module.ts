import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccueilEntrepreneurPageRoutingModule } from './accueil-entrepreneur-routing.module';

import { AccueilEntrepreneurPage } from './accueil-entrepreneur.page';
//import {Ng2SearchPipeModule} from 'ng2-search-filter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccueilEntrepreneurPageRoutingModule,
   // Ng2SearchPipeModule
  ],
  declarations: [AccueilEntrepreneurPage]
})
export class AccueilEntrepreneurPageModule {}
