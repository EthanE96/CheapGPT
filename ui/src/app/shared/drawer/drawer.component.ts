import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Trash } from 'lucide-angular';
import { Observable, tap } from 'rxjs';

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
  chats$: Observable<Chat[]> = new Observable();
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.getChats();
  }

  getChats() {
    this.chats$ = this.chatService.getChats();
  }

  selectChat(chat: Chat) {
    this.chatChange.emit(chat);
  }

  newChat() {
    this.chatService
      .postChat({
        model: 'GPT-4',
        apiKey: 'Test key',
      })
      .pipe(
        tap((chat) => {
          this.selectChat(chat);
        })
      )
      .subscribe();
  }

  editChat(chat: Chat) {
    this.chatService.patchChat(chat).subscribe();
  }

  deleteChat(chat: Chat) {
    if (!chat._id) {
      return console.error('Chat not found'); //! fix
    } else {
      this.chatService.deleteChat(chat._id).subscribe();
    }

    //if last chat, create a new chat
  }

  onSelect(chat: Chat) {
    this.selectChat(chat);
    this.onClose();
  }

  onEdit(chat: Chat) {
    console.log('edit', chat); //! remove
    this.editChat(chat);
    this.onClose();
  }

  onDelete(chat: Chat) {
    console.log('delete', chat); //! remove
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
    this.getChats();
    this.isChecked = !this.isChecked;
  }
}
