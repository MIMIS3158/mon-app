import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeconnexionPageRoutingModule } from './signout-routing.module';

import { DeconnexionPage } from './signout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeconnexionPageRoutingModule
  ],
  declarations: [DeconnexionPage]
})
export class SignoutPageModule {}
