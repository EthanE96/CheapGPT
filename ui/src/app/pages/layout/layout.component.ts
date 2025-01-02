import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { Chat } from '../../models/chat.model';
import { DrawerComponent } from '../drawer/drawer.component';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  PanelLeftOpen,
  Settings,
  Sun,
  Moon,
} from 'lucide-angular';
import { Router } from '@angular/router';
import { LlmModelSettingsComponent } from './llm-model-settings/llm-model-settings.component';
import { AuthService } from '../../services/auth.service';
import { ThemeComponent } from '../../shared/theme/theme.component';

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
  readonly Sun = Sun;
  readonly Moon = Moon;

  @Input() isDrawerOpen: boolean = true;
  @Output() isDrawerOpenChange = new EventEmitter();

  $currentUser = this.authService.$currentUser;
  selectedChat: Chat = {
    model: 'GPT-4',
    apiKey: 'Test key',
    message: [],
  };
  newMessage: boolean = false;
  currentTheme = this.themeComponent.currentTheme;
  defaultTheme = this.themeComponent.defaultTheme;
  logo = this.themeComponent.logo;

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeComponent: ThemeComponent
  ) {}

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

  onThemeToggle() {
    this.themeComponent.toggleTheme();
    this.logo = this.themeComponent.logo;
  }
}
