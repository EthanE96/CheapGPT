import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class LayoutComponent implements OnInit {
  @Input() isDrawerOpen: boolean = true;
  @Output() isDrawerOpenChange = new EventEmitter();

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.isDrawerOpen = window.innerWidth >= 768;
    }
  }

  selectedChat?: Chat;
  newMessage: boolean = false;
  newChat?: Chat;

  onNewMessage(chat: Chat) {
    this.newMessage = true;
    this.selectedChat = chat;
  }

  onNewChat() {
    this.selectedChat = undefined;
    this.newMessage = false;
  }

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }
}
