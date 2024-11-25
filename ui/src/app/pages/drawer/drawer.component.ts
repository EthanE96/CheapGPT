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
  private storageKey = 'currentlyOpenChat';

  @Input() isDrawerOpen: boolean = true;
  @Input() set newMessage(value: boolean) {
    Promise.resolve().then(() => {
      if (value === true) {
        this.loadChats();
        this.newMessageChange.emit(false);
      }
    });
  }
  @Output() newMessageChange = new EventEmitter();
  @Output() isDrawerOpenChange = new EventEmitter();
  @Output() chatSelectedChange = new EventEmitter();
  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;

  chats: Chat[] = [];
  isEditing: boolean = false;
  editingChat?: Chat;
  editingValue: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadChats();
    this.loadCurrentlyOpenChat();
  }

  onSelectChat(chat: Chat) {
    this.saveCurrentlyOpenChat(chat);
    this.chatSelectedChange.emit(chat);
  }

  onNewChat() {
    this.newChat();
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
      if (this.chats.length === 1) {
        this.newChat();
        this.chatService.deleteChat(chat._id).subscribe(() => {
          this.loadChats();
        });
      } else {
        this.chatService.deleteChat(chat._id).subscribe(() => {
          this.loadChats();
        });
      }

      if (this.storageKey === chat._id) {
        localStorage.removeItem(this.storageKey);
      }
    }
  }

  onDeleteAllChats() {
    this.chatService.deleteChats().subscribe(() => {
      this.newChat();
      this.loadChats();
    });
    localStorage.removeItem(this.storageKey);
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
    this.chatService.getChats().subscribe((chats) => (this.chats = chats));
  }

  private newChat() {
    this.chatService
      .postChat({
        model: 'GPT-4',
        apiKey: 'Test key',
        message: [],
      })
      .pipe(
        tap((chat) => {
          this.saveCurrentlyOpenChat(chat);
          this.onSelectChat(chat);
        })
      )
      .subscribe(() => this.loadChats());
  }

  private loadCurrentlyOpenChat() {
    const storedChatId = localStorage.getItem(this.storageKey);
    if (storedChatId) {
      this.chatService.getChat(storedChatId).subscribe((chat) => {
        if (chat) {
          this.chatSelectedChange.emit(chat);
        }
      });
    }
  }

  private saveCurrentlyOpenChat(chat: Chat) {
    if (!chat._id) {
      throw new Error('Chat does not have an ID');
    }
    localStorage.setItem(this.storageKey, chat._id);
  }
}
