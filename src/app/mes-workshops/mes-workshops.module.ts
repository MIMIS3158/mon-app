import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesWorkshopsPageRoutingModule } from './mes-workshops-routing.module';

import { MesWorkshopsPage } from './mes-workshops.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesWorkshopsPageRoutingModule,
    TranslateModule
  ],
  declarations: [MesWorkshopsPage]
})
export class MesWorkshopsPageModule {}
