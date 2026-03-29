import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileDevPageRoutingModule } from './profile-dev-routing.module';

import { ProfileDevPage } from './profile-dev.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileDevPageRoutingModule,
  ],
  declarations: [ProfileDevPage],
})
export class ProfileDevPageModule {}
