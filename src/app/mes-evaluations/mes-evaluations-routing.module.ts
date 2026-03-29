import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesEvaluationsPage } from './mes-evaluations.page';

const routes: Routes = [
  {
    path: '',
    component: MesEvaluationsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesEvaluationsPageRoutingModule {}
