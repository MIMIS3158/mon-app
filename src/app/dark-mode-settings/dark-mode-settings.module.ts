import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DarkModeSettingsPageRoutingModule } from './dark-mode-settings-routing.module';

import { DarkModeSettingsPage } from './dark-mode-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DarkModeSettingsPageRoutingModule
  ],
  declarations: [DarkModeSettingsPage]
})
export class DarkModeSettingsPageModule {}
