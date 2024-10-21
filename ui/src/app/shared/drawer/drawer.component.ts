import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Trash } from 'lucide-angular';
import { tap } from 'rxjs';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent implements OnInit {
  readonly Trash = Trash;
  @Output() chatChange = new EventEmitter();
  isChecked: boolean = false;
  chats: Chat[] = [];
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.getChats();
  }

  selectChat(chat: Chat) {
    this.chatChange.emit(chat);
  }

  getChats() {
    this.chatService.getChats().subscribe((chats) => {
      this.chats = chats;
    });
  }

  newChat() {
    this.chatService
      .postChat({
        model: 'GPT-4',
        apiKey: 'Test key',
      })
      // here will need llm to update title then it calls back
      .pipe(
        tap((chat) => {
          this.selectChat(chat);
        })
      )
      .subscribe(() => {
        this.getChats();
      });
  }

  deleteChat(chat: Chat) {
    if (!chat._id) {
      return console.error('Chat not found');
    }

    if (this.chats.length === 1) {
      this.newChat();
    }

    this.chatService.deleteChat(chat._id).subscribe(() => {
      this.getChats();
    });
  }

  onSelect(chat: Chat) {
    this.selectChat(chat);
    this.onClose();
  }

  onDelete(chat: Chat) {
    this.deleteChat(chat);
    this.onClose();
  }

  onNew() {
    this.newChat();
    this.onClose();
  }

  onClear() {
    this.chatService.deleteChats().subscribe();
    this.newChat();
    this.onClose();
  }

  onClose() {
    this.isChecked = !this.isChecked;
  }

  onOpen() {
    this.isChecked = !this.isChecked;
  }
}
