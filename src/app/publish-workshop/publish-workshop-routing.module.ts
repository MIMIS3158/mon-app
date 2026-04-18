import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublishWorkshopPage } from './publish-workshop.page';

const routes: Routes = [
  {
    path: '',
    component: PublishWorkshopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublishWorkshopPageRoutingModule {}
