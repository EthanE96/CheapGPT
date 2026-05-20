import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('css', css);
hljs.registerLanguage('go', go);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('php', php);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('yaml', yaml);
import { Chat, StreamEvent } from '../../models/chat.model';
import { ChatService } from '../../services/chat.service';
import { InputComponent } from '../../shared/input/input.component';
import { NewChatComponent } from './new-chat/new-chat.component';
import { LucideAngularModule, ArrowDown } from 'lucide-angular';
import { ModelsService } from '../../services/models.service';
import { Model } from '../../models/model.model';

marked.use(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);

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
  isAtBottom = true;
  isStreaming = false;
  streamingContent = '';
  currentStyle = 'balanced';
  private errorTimer: ReturnType<typeof setTimeout> | null = null;
  private programmaticScroll = false;

  constructor(
    private chatService: ChatService,
    private modelService: ModelsService,
  ) {}

  models$: Observable<Model[]> = this.modelService.getModels();
  model$: Observable<Model | undefined> = this.models$.pipe(
    map((models) => models.find((model) => model._id === this.chat?.modelId)),
  );

  async sendMessage(
    message: string,
    newMessage?: boolean,
    modelNameOverride?: string,
    styleOverride?: string,
  ) {
    try {
      // get llm model
      const modelName =
        modelNameOverride ||
        localStorage.getItem('model') ||
        'llama-3.3-70b-versatile';
      const model = (await firstValueFrom(this.models$)).find(
        (m) => m.modelName === modelName,
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
          }),
        );
      }

      if (!this.chat || !this.chat._id) {
        throw new Error('Chat not found');
      }

      // add message optimistically
      this.chat.message.push({ content: message, isUser: true });
      this.scrollToBottom();

      // begin streaming
      this.isStreaming = true;
      this.streamingContent = '';
      if (styleOverride) this.currentStyle = styleOverride;

      await new Promise<void>((resolve, reject) => {
        this.chatService
          .streamMessage(this.chat!._id!, message, this.currentStyle)
          .subscribe({
            next: (event: StreamEvent) => {
              if (event.type === 'chunk') {
                this.streamingContent += event.content;
                if (this.isAtBottom) this.scrollToBottomInstant();
              } else if (event.type === 'done') {
                this.chat = event.chat;
                this.isStreaming = false;
                this.streamingContent = '';
                this.scrollToBottom();
                this.newMessage.emit(this.chat);
                resolve();
              } else if (event.type === 'error') {
                reject(new Error(event.message));
              }
            },
            error: reject,
            complete: resolve,
          });
      });
    } catch (error) {
      this.isStreaming = false;
      this.streamingContent = '';
      if (this.chat?.message?.length) {
        this.chat.message.pop();
      }
      this.showError(this.extractErrorMessage(error));
    }
  }

  private extractErrorMessage(error: unknown): string {
    const body = (error as HttpErrorResponse)?.error?.error as
      | string
      | undefined;
    if (body) {
      try {
        const jsonStr = body.substring(body.indexOf('{'));
        const parsed = JSON.parse(jsonStr);
        if (parsed?.error?.message) return parsed.error.message;
      } catch {
        /* fall through */
      }
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

  onScroll() {
    if (this.programmaticScroll) return;
    const el = this.scrollContainer.nativeElement;
    this.isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
  }

  private scrollToBottomInstant() {
    const el = this.scrollContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  scrollToBottom() {
    this.isAtBottom = true;
    this.programmaticScroll = true;
    setTimeout(() => {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
      setTimeout(() => (this.programmaticScroll = false), 400);
    }, 100);
  }
}
