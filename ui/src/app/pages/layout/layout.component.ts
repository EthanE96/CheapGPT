import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ModalSettingsComponent } from '../../shared/modal-settings/modal-settings.component';
import { DrawerComponent } from '../../shared/drawer/drawer.component';
import { Chat } from '../../models/chat';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ChatComponent, ModalSettingsComponent, DrawerComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  chat: Chat = {
    model: '',
    apiKey: '',
    title: '',
  };

  onModelChange(model: unknown) {
    if (model) {
      console.log('model change');
    }
  }

  onChatChange(chat: Chat) {
    this.chat = chat;
  }
}
