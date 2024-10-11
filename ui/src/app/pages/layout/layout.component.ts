import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ModalSettingsComponent } from '../../shared/modal-settings/modal-settings.component';
import { DrawerComponent } from '../../shared/drawer/drawer.component';
import { ChatString } from '../../models/chat';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ChatComponent, ModalSettingsComponent, DrawerComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  chatString: ChatString = {
    model: '',
    apiKey: '',
    title: '',
  };

  onModelChange(model: unknown) {
    console.log('model changed');
    console.log(model);
  }

  onChatChange(chatString: ChatString) {
    this.chatString = chatString;
    console.log('layout chat string updated', chatString);
  }
}
