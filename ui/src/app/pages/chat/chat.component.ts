import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { Chat } from '../../models/chat';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  @Input() chat?: Chat;

  sendMessage(content: string) {
    if (content.trim() !== '') {
      this.addMessage(content, true);

      // will send the new message to the AI, then wait for ai to respond, then add the ai response to the chat string
      setTimeout(() => this.addMessage(`I received: ${content}`, false), 500);

      console.log(this.chat); //! remove
    }
  }

  private addMessage(content: string, isUser: boolean) {
    // if existing chat string
    if (this.chat && this.chat.message) {
      this.chat.message.push({ content, isUser, date: new Date() });
    }

    // if new chat string
    else {
      this.chat = {
        message: [{ content, isUser, date: new Date() }],
        model: '',
        apiKey: '',
        title: 'New Chat',
      };
    }
  }
}
