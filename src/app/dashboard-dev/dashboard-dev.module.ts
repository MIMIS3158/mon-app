import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardDevPageRoutingModule } from './dashboard-dev-routing.module';

import { DashboardDevPage } from './dashboard-dev.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardDevPageRoutingModule
  ],
  declarations: [DashboardDevPage]
})
export class DashboardDevPageModule {}
