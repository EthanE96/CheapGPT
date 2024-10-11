import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatString } from '../../models/chat';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent implements OnInit {
  @Output() chatChange = new EventEmitter();

  isChecked: boolean = false;
  chatStrings: ChatString[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.getChats();
  }

  getChats() {
    this.chatStrings = this.chatService.getAllChats();
  }
  handleClick(chatString?: ChatString) {
    //^ send to chat component
    if (chatString) {
      this.chatChange.emit(chatString);
      console.log(chatString); //! remove
    }
    this.isChecked = !this.isChecked;
  }
}
