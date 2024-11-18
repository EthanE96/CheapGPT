import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  EllipsisVertical,
  PanelLeftClose,
  SquarePlus,
  Trash,
  Pencil,
} from 'lucide-angular';
import { tap } from 'rxjs';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent implements OnInit {
  readonly EllipsisVertical = EllipsisVertical;
  readonly PanelLeftClose = PanelLeftClose;
  readonly SquarePlus = SquarePlus;
  readonly Trash = Trash;
  readonly Pencil = Pencil;

  @Input() isDrawerOpen: boolean = true;
  @Output() isDrawerOpenChange = new EventEmitter();
  @Output() chatSelectedChange = new EventEmitter();
  chats: Chat[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadChats();
  }

  async loadChats() {
    this.chatService.getChats().subscribe((chats) => {
      this.chats = chats;
    });
  }

  onSelectChat(chat: Chat) {
    // handle in component
    this.chatSelectedChange.emit(chat);
    console.log('selected chat', chat); //! REMOVE
  }

  onNewChat() {
    // handle in component
    console.log('new chat'); //! REMOVE
  }

  onRenameChat(chat: Chat) {
    console.log('rename chat', chat); //! REMOVE
  }

  onDeleteChat(chat: Chat) {
    console.log('delete chat', chat); //! REMOVE
  }

  onDeleteAllChats() {
    console.log('delete all chats'); //! REMOVE
  }

  //^ Chat Logic
  newChat() {
    this.chatService
      .postChat({
        model: 'GPT-4',
        apiKey: 'Test key',
      })
      .pipe(
        tap((chat) => {
          this.onSelectChat(chat);
        })
      )
      .subscribe(() => {
        this.loadChats();
      });
  }

  deleteChat(chat?: Chat) {
    if (chat && chat._id) {
      this.chatService.deleteChat(chat._id).subscribe();
    } else {
      this.chatService.deleteChats().subscribe();
    }
    //if last chat
    if (this.chats.length === 1) {
      this.newChat();
    }
    this.loadChats();
  }

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }
}
