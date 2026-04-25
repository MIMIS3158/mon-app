import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccueilEntrepreneurPageRoutingModule } from './accueil-entrepreneur-routing.module';

import { AccueilEntrepreneurPage } from './accueil-entrepreneur.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccueilEntrepreneurPageRoutingModule,
    TranslateModule
  ],
  declarations: [AccueilEntrepreneurPage],
})
export class AccueilEntrepreneurPageModule {}
