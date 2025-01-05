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

  selectedChat?: Chat;
  newMessage: boolean = false;
  newChat?: Chat;

  currentTheme = this.themeComponent.currentTheme;
  imgTheme = this.currentTheme === 'dark' ? Sun : Moon;
  logo = this.themeComponent.logo;

  constructor(private router: Router, private themeComponent: ThemeComponent) {}

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }

  onNewMessage(chat: Chat) {
    this.newMessage = true;
    this.selectedChat = chat;
  }

  onLogout() {
    this.router.navigate(['/logout']);
  }

  onThemeToggle() {
    this.currentTheme = this.themeComponent.toggleTheme();
    this.logo = this.themeComponent.logo;
    this.imgTheme = this.currentTheme === 'dark' ? Sun : Moon;
  }
}
