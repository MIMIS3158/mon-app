import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DarkModeSettingsPage } from './dark-mode-settings.page';

const routes: Routes = [
  {
    path: '',
    component: DarkModeSettingsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DarkModeSettingsPageRoutingModule {}
