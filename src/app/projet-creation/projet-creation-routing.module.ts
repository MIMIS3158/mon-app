import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjetCreationPage } from './projet-creation.page';

const routes: Routes = [
  {
    path: '',
    component: ProjetCreationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjetCreationPageRoutingModule {}
