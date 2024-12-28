import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { ModalSettingsComponent } from '../modal-settings/modal-settings.component';
import { Chat } from '../../models/chat.model';
import { DrawerComponent } from '../drawer/drawer.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, PanelLeftOpen } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ChatComponent,
    ModalSettingsComponent,
    DrawerComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  readonly PanelLeftOpen = PanelLeftOpen;
  @Input() isDrawerOpen: boolean = true;
  @Output() isDrawerOpenChange = new EventEmitter();

  currentUser: User | null = null;
  selectedChat: Chat = {
    model: 'GPT-4',
    apiKey: 'Test key',
    message: [],
  };
  newMessage: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }

  onModelChange(model: unknown) {
    if (model) {
      console.log('model change'); //! REMOVE
    }
  }

  onChatSelected(chat: Chat) {
    this.selectedChat = chat;
  }

  onNewMessage() {
    this.newMessage = true;
  }
}
