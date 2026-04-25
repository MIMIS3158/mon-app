import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostulationPageRoutingModule } from './postulation-routing.module';

import { PostulationPage } from './postulation.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostulationPageRoutingModule,
    TranslateModule
  ],
  declarations: [PostulationPage],
})
export class PostulationPageModule {}
