import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { Chat, Message } from '../../models/chat';
import { ChatService } from '../../services/chat.service';
import { marked } from 'marked';
import { lastValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent {
  @Input() chat?: Chat;
  htmlMessages: Message[] = [];

  constructor(private chatService: ChatService) {}

  async sendMessage(content: string) {
    if (!this.chat?.message) {
      this.chat = await lastValueFrom(this.createNewChat());
    }

    if (content.trim() !== '' && this.chat?._id) {
      try {
        this.chatService
          .postMessage(this.chat._id, content)
          .subscribe((chat) => {
            this.chat = chat;
            this.toHTML(this.chat);
          });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  private createNewChat(): Observable<Chat> {
    return this.chatService.postChat({
      model: 'GPT-4',
      apiKey: 'Test key',
    });
  }

  private toHTML(chat: Chat): Message[] {
    if (chat.message) {
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
