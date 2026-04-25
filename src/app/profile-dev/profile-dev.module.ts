import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileDevPageRoutingModule } from './profile-dev-routing.module';

import { ProfileDevPage } from './profile-dev.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileDevPageRoutingModule,
    TranslateModule
  ],
  declarations: [ProfileDevPage],
})
export class ProfileDevPageModule {}
