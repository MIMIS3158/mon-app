import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileEntrepreneurPageRoutingModule } from './profile-entrepreneur-routing.module';

import { ProfileEntrepreneurPage } from './profile-entrepreneur.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileEntrepreneurPageRoutingModule,
    TranslateModule
  ],
  declarations: [ProfileEntrepreneurPage],
})
export class ProfileEntrepreneurPageModule {}
