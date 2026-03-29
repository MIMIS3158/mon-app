import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SauvegarderPage } from './sauvegarder.page';

const routes: Routes = [
  {
    path: '',
    component: SauvegarderPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SauvegarderPageRoutingModule {}
