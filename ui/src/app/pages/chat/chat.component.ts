import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  messages: ChatMessage[] = [];

  sendMessage(content: string) {
    if (content.trim() !== '') {
      this.addMessage(content, true);
      // Simulate a response (replace with actual API call in a real app)
      setTimeout(() => this.addMessage(`I received: ${content}`, false), 1000);
      console.log(this.messages);
    }
  }

  private addMessage(content: string, isUser: boolean) {
    this.messages.push({ content, isUser, token: 50 });
  }
}

export interface ChatMessage {
  content: string;
  isUser: boolean;
  token: number;
}
