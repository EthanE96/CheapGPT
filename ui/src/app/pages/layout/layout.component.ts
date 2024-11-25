import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ModalSettingsComponent } from '../modal-settings/modal-settings.component';
import { Chat } from '../../models/chat';
import { DrawerComponent } from '../drawer/drawer.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, PanelLeftOpen } from 'lucide-angular';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ChatComponent,
    ModalSettingsComponent,
    DrawerComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  readonly PanelLeftOpen = PanelLeftOpen;

  @Input() isDrawerOpen: boolean = true;
  @Output() isDrawerOpenChange = new EventEmitter();
  selectedChat: Chat = {
    model: 'GPT-4',
    apiKey: 'Test key',
    message: [],
  };
  newMessage: boolean = false;

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }

  onModelChange(model: unknown) {
    if (model) {
      console.log('model change'); //! REMOVE
    }
  }

  onChatSelected(chat: Chat) {
    this.selectedChat = chat;
  }

  onNewMessage() {
    this.newMessage = true;
  }
}
