import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostulationPage } from './postulation.page';

const routes: Routes = [
  {
    path: '',
    component: PostulationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostulationPageRoutingModule {}
