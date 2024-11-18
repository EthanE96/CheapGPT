import { Component, Input } from '@angular/core';
import { Chat } from '../../models/chat';
import { InputComponent } from '../../shared/input/input.component';

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.scss',
})
export class NewChatComponent {
  @Input() chat?: Chat;

  async newChat(message: string) {
    console.log('new message', message);
  }
}
