import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileEntrepreneurPage } from './profile-entrepreneur.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileEntrepreneurPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileEntrepreneurPageRoutingModule {}
