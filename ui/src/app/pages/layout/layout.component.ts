import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { Chat } from '../../models/chat.model';
import { DrawerComponent } from '../drawer/drawer.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, PanelLeftOpen, Settings } from 'lucide-angular';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { LlmModelSettingsComponent } from './llm-model-settings/llm-model-settings.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ChatComponent,
    LlmModelSettingsComponent,
    DrawerComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  readonly PanelLeftOpen = PanelLeftOpen;
  readonly Settings = Settings;

  @Input() isDrawerOpen: boolean = true;
  @Output() isDrawerOpenChange = new EventEmitter();

  currentUser: User | null = null;
  selectedChat: Chat = {
    model: 'GPT-4',
    apiKey: 'Test key',
    message: [],
  };
  newMessage: boolean = false;

  constructor(private router: Router) {}

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

  onLogout() {
    this.router.navigate(['/logout']);
  }
}
