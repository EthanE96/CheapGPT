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
}
