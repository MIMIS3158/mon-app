import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardEntrepreneurPageRoutingModule } from './dashboard-entrepreneur-routing.module';

import { DashboardEntrepreneurPage } from './dashboard-entrepreneur.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardEntrepreneurPageRoutingModule,
    TranslateModule
    
  ],
  declarations: [DashboardEntrepreneurPage],
})
export class DashboardEntrepreneurPageModule {}
