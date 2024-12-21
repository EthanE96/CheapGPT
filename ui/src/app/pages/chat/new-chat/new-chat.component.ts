import { Component, EventEmitter, Output } from '@angular/core';
import { InputComponent } from '../../../shared/input/input.component';

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.scss',
})
export class NewChatComponent {
  @Output() newMessageOut = new EventEmitter<string>();
}
