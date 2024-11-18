import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chat } from '../../../models/chat';
import { InputComponent } from '../../../shared/input/input.component';

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.scss',
})
export class NewChatComponent {
  @Input() chat?: Chat;
  @Output() messageOut = new EventEmitter<string>();

  async newChat(message: string) {
    this.messageOut.emit(message);
  }
}
