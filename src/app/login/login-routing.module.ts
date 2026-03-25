import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: SigninPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InscriptionPageRoutingModule {}
