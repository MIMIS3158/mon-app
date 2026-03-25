import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileDevPage } from './profile-dev.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileDevPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileDevPageRoutingModule {}
