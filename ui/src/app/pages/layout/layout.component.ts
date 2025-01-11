import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';
import { Chat } from '../../models/chat.model';
import { DrawerComponent } from '../drawer/drawer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ChatComponent, DrawerComponent, HeaderComponent, NgIf],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @Input() isDrawerOpen: boolean = true;
  @Output() isDrawerOpenChange = new EventEmitter();

  selectedChat?: Chat;
  newMessage: boolean = false;
  newChat?: Chat;

  onNewMessage(chat: Chat) {
    this.newMessage = true;
    this.selectedChat = chat;
  }

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }
}
