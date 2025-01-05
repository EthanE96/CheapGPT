import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Chat } from '../../models/chat.model';
import { ChatService } from '../../services/chat.service';
import { marked } from 'marked';
import { InputComponent } from '../../shared/input/input.component';
import { NewChatComponent } from './new-chat/new-chat.component';
import { LucideAngularModule, ArrowDown } from 'lucide-angular';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ModelsService } from '../../services/models.service';
import { Model } from '../../models/model.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    NewChatComponent,
    InputComponent,
    LucideAngularModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  readonly ArrowDown = ArrowDown;

  @Input() chat?: Chat;
  @Output() newMessage = new EventEmitter<Chat>();
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private modelService: ModelsService
  ) {}

  models$: Observable<Model[]> = this.modelService.getModels();
  logo$: Observable<string> = this.models$.pipe(
    map((models) => {
      const model = models.find((m) => m._id === this.chat?.modelId);
      return model
        ? model.logo
        : 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';
    })
  );

  async sendMessage(message: string, newMessage?: boolean) {
    // get llm model
    const modelName =
      localStorage.getItem('model') || 'llama-3.3-70b-versatile';
    const model = (await firstValueFrom(this.models$)).find(
      (m) => m.modelName === modelName
    );
    if (!model || !model._id) {
      throw new Error('Model not found');
    }

    if (newMessage) {
      // create a new chat
      this.chat = await firstValueFrom(
        this.chatService.postChat({
          modelId: model._id,
          message: [],
        })
      );
    }

    if (!this.chat || !this.chat._id) {
      throw new Error('Chat not found');
    }

    // add message
    this.chat.message.push({
      content: message,
      isUser: true,
    });
    this.scrollToBottom();

    // post message
    this.chat = await firstValueFrom(
      this.chatService.postMessage(this.chat._id, message)
    );
    this.scrollToBottom();

    // emit update
    this.newMessage.emit(this.chat);
  }

  toHTML(message: string) {
    return marked(message);
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }, 100);
  }
}
