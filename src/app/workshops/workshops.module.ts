import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkshopsPageRoutingModule } from './workshops-routing.module';

import { WorkshopsPage } from './workshops.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkshopsPageRoutingModule,
    TranslateModule
  ],
  declarations: [WorkshopsPage]
})
export class WorkshopsPageModule {}
