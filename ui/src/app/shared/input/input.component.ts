import { Component, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { LucideAngularModule, Send } from 'lucide-angular';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  readonly Send = Send;
  @Output() valueOut = new EventEmitter<string>();

  constructor(private chatService: ChatService) {}

  async sendValue(content: string) {
    if (content.trim() !== '') {
      this.valueOut?.emit(content);
    }
  }

  onEnterKey(event: Event, textarea: HTMLTextAreaElement) {
    const keyEvent = event as KeyboardEvent;
    if (!keyEvent.shiftKey) {
      event.preventDefault();
      this.sendValue(textarea.value);
      textarea.value = '';
      this.autoResize(textarea);
    }
  }

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }
}
