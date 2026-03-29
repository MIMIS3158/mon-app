import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublierProjetPage } from './publier-projet.page';

const routes: Routes = [
  {
    path: '',
    component: PublierProjetPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublierProjetPageRoutingModule {}
