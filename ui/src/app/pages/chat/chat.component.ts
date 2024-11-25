import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Chat } from '../../models/chat';
import { ChatService } from '../../services/chat.service';
import { marked } from 'marked';
import { InputComponent } from '../../shared/input/input.component';
import { NewChatComponent } from './new-chat/new-chat.component';
import { LucideAngularModule, ArrowDown } from 'lucide-angular';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    NewChatComponent,
    InputComponent,
    LucideAngularModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  readonly ArrowDown = ArrowDown;
  @Input() chat?: Chat;
  @Output() newMessage = new EventEmitter<void>();
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  sendMessage(message: string, newMessage?: boolean) {
    if (!this.chat || !this.chat?._id) {
      throw new Error('Chat not found');
    }
    this.chat.message.push({
      content: message,
      isUser: true,
    });
    this.scrollToBottom();

    this.chatService.postMessage(this.chat._id, message).subscribe((chat) => {
      this.chat = chat;
      //refreshes the drawer chats (bc new title)
      if (newMessage) {
        this.newMessage.emit();
      }
      this.scrollToBottom();
    });
  }

  toHTML(message: string) {
    return marked(message);
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }, 100);
  }
}
