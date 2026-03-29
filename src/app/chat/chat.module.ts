import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ContactInfoComponent } from './contact-info/contact-info.component';

import { ChatPage } from './chat.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChatPageRoutingModule],
  declarations: [ChatPage, ContactInfoComponent],
})
export class ChatPageModule {}
