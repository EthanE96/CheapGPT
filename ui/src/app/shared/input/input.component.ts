import { Component, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Output() messageOut = new EventEmitter<string>();

  constructor(private chatService: ChatService) {}

  async sendMessage(content: string) {
    if (content.trim() !== '') {
      this.messageOut?.emit(content);
    }
  }
}
