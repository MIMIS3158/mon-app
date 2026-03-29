import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileEntrepreneurPageRoutingModule } from './profile-entrepreneur-routing.module';

import { ProfileEntrepreneurPage } from './profile-entrepreneur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileEntrepreneurPageRoutingModule,
  ],
  declarations: [ProfileEntrepreneurPage],
})
export class ProfileEntrepreneurPageModule {}
