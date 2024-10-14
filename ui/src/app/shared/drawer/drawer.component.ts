import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent implements OnInit {
  @Output() chatChange = new EventEmitter();
  isChecked: boolean = false;
  chats$: Observable<Chat[]> = new Observable();
  constructor(private chatService: ChatService) {}

  //TODO: When click on button to open, then get chats

  ngOnInit(): void {
    this.getChats();
  }

  getChats() {
    this.chats$ = this.chatService.getChats();
  }

  selectChat(chat: Chat) {
    // send to chat component
    this.chatChange.emit(chat);
    this.onClose();
  }

  newChat() {
    //! THIS IS NOT WORKING
    const chat = this.chatService.postChat({
      model: 'GPT-4',
      apiKey: 'Test key',
    });
    console.log('new chat', chat);
  }

  clearChat() {}

  onClose() {
    this.isChecked = !this.isChecked;
  }
}
