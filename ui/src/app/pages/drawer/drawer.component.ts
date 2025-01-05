import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/chat.model';
import { CommonModule } from '@angular/common';

import {
  LucideAngularModule,
  EllipsisVertical,
  PanelLeftClose,
  SquarePlus,
  Trash,
  Pencil,
} from 'lucide-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';

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
  @Input() selectedChat?: Chat;
  @Input() set newMessage(value: boolean) {
    Promise.resolve().then(() => {
      if (value === true) {
        // chat component created a new chat and message and its
        console.log('test new message chat in drawer', this.selectedChat); //! REMOVE
        this.loadChats();
        this.newMessageChange.emit(false);
      }
    });
  }
  @Output() newMessageChange = new EventEmitter();
  @Output() isDrawerOpenChange = new EventEmitter();
  @Output() selectedChatChange = new EventEmitter<Chat | undefined>();
  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;

  chats: Chat[] = [];
  isEditing: boolean = false;
  editingChat?: Chat;
  editingValue: string = '';

  constructor(private chatService: ChatService) {}

  // TODO: On clear chats, make the chat screen undefined to show the new chat screen

  ngOnInit(): void {
    this.loadChats();
  }

  onSelectChat(chat: Chat) {
    this.selectedChat = chat;
    this.selectedChatChange.emit(chat);
  }

  onNewChat() {
    this.selectedChat = undefined;
    this.selectedChatChange.emit(undefined);
  }

  onToggleEdit(chat: Chat) {
    this.editingChat = chat;
    this.editingValue = chat.title!;
    this.isEditing = !this.isEditing;
    this.focusInput();
  }

  onSaveEdit(chat: Chat, input: string) {
    chat.title = input;
    this.chatService.patchChat(chat).subscribe(() => {
      this.editingChat = undefined;
      this.isEditing = false;
      this.loadChats();
    });
  }

  onCancelEdit() {
    this.editingChat = undefined;
    this.isEditing = false;
  }

  onDeleteChat(chat: Chat) {
    if (chat && chat._id) {
      this.chatService.deleteChat(chat._id).subscribe(() => {
        this.loadChats();
      });
    }
  }

  onDeleteAllChats() {
    this.chatService.deleteChats().subscribe({
      complete: () => {
        this.loadChats();
      },
    });
  }

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }

  focusInput() {
    setTimeout(() => {
      this.chatInput?.nativeElement?.focus();
    }, 0);
  }

  //^ Chat Logic
  private loadChats() {
    this.chatService
      .getChats()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of([]);
          } else {
            return throwError(() => error);
          }
        })
      )
      .subscribe({
        next: (chats) => {
          this.chats = chats;
        },
      });
  }
}
