import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublierProjetPageRoutingModule } from './publier-projet-routing.module';

import { PublierProjetPage } from './publier-projet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublierProjetPageRoutingModule,
  ],
  declarations: [PublierProjetPage],
})
export class PublishProjectPageModule {}
