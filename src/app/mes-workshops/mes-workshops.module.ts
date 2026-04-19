import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesWorkshopsPageRoutingModule } from './mes-workshops-routing.module';

import { MesWorkshopsPage } from './mes-workshops.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesWorkshopsPageRoutingModule
  ],
  declarations: [MesWorkshopsPage]
})
export class MesWorkshopsPageModule {}
