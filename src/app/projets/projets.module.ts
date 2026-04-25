import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjetsPageRoutingModule } from './projets-routing.module';

import { ProjetsPage } from './projets.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProjetsPageRoutingModule, TranslateModule],
  declarations: [ProjetsPage],
})
export class ProjetsPageModule {}
