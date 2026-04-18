import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublishWorkshopPageRoutingModule } from './publish-workshop-routing.module';

import { PublishWorkshopPage } from './publish-workshop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublishWorkshopPageRoutingModule
  ],
  declarations: [PublishWorkshopPage]
})
export class PublishWorkshopPageModule {}
