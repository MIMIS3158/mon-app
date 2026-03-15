import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccueilDeveloppeurPage } from './accueil-developpeur.page';

const routes: Routes = [
  {
    path: '',
    component: AccueilDeveloppeurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccueilDeveloppeurPageRoutingModule {}
