import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardDevPage } from './dashboard-dev.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardDevPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardDevPageRoutingModule {}
