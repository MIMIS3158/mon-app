import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProjetCreationPageRoutingModule } from './projet-creation-routing.module';
import { ProjetCreationPage } from './projet-creation.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjetCreationPageRoutingModule,
    TranslateModule
  ],
  declarations: [ProjetCreationPage],
})
export class ProjetCreationPageModule {}
