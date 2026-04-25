import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesEvaluationsPageRoutingModule } from './mes-evaluations-routing.module';

import { MesEvaluationsPage } from './mes-evaluations.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesEvaluationsPageRoutingModule,
    TranslateModule
  ],
  declarations: [MesEvaluationsPage],
})
export class MesEvaluationsPageModule {}
