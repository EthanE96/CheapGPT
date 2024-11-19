import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chat, Message } from '../../models/chat';
import { ChatService } from '../../services/chat.service';
import { marked } from 'marked';
import { InputComponent } from '../../shared/input/input.component';
import { NewChatComponent } from './new-chat/new-chat.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, NewChatComponent, InputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  @Input() chat?: Chat;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  htmlMessages = this.toHTML(this.chat);

  constructor(private chatService: ChatService) {}

  sendMessage(message: string) {
    if (!this.chat || !this.chat?._id) {
      throw new Error('Chat not found');
    }
    this.chat.message.push({
      content: message,
      isUser: true,
    });
    this.scrollToBottom();
    this.postMessage(this.chat._id, message);
  }

  private postMessage(id: string, message: string) {
    this.chatService.postMessage(id, message).subscribe({
      next: (chat) => {
        this.chat = chat;
        this.htmlMessages = this.toHTML(chat);
        console.log(this.htmlMessages); //! REMOVE
      },
      complete: () => {
        this.scrollToBottom();
      },
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }, 100);
  }
  private toHTML(chat?: Chat): Message[] {
    if (chat && chat.message) {
      return chat.message.map((message) => {
        if (!message.isUser) {
          message.content = marked(message.content) as string;
        }
        return message;
      });
    }
    return [];
  }
}
