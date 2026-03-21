import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardEntrepreneurPage } from './dashboard-entrepreneur.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardEntrepreneurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardEntrepreneurPageRoutingModule {}
