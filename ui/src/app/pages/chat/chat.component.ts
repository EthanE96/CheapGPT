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
import { HttpErrorResponse } from '@angular/common/http';

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

  errorMessage: string | null = null;
  private errorTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private chatService: ChatService,
    private modelService: ModelsService
  ) {}

  models$: Observable<Model[]> = this.modelService.getModels();
  model$: Observable<Model | undefined> = this.models$.pipe(
    map((models) => models.find((model) => model._id === this.chat?.modelId))
  );

  async sendMessage(message: string, newMessage?: boolean) {
    try {
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

      // add message optimistically
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
    } catch (error) {
      // Remove the optimistically-added user message so the spinner clears
      if (this.chat?.message?.length) {
        this.chat.message.pop();
      }
      this.showError(this.extractErrorMessage(error));
    }
  }

  private extractErrorMessage(error: unknown): string {
    const body = (error as HttpErrorResponse)?.error?.error as string | undefined;
    if (body) {
      try {
        const jsonStr = body.substring(body.indexOf('{'));
        const parsed = JSON.parse(jsonStr);
        if (parsed?.error?.message) return parsed.error.message;
      } catch { /* fall through */ }
      return body;
    }
    return 'Something went wrong. Please try again.';
  }

  private showError(message: string) {
    if (this.errorTimer) clearTimeout(this.errorTimer);
    this.errorMessage = message;
    this.errorTimer = setTimeout(() => (this.errorMessage = null), 6000);
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
