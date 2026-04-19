import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesWorkshopsPage } from './mes-workshops.page';

const routes: Routes = [
  {
    path: '',
    component: MesWorkshopsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesWorkshopsPageRoutingModule {}
