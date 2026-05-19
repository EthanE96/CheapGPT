import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { InputComponent } from '../../../shared/input/input.component';
import { ModelsService } from '../../../services/models.service';
import { Model } from '../../../models/model.model';
import { firstValueFrom } from 'rxjs';
import { LucideAngularModule, Info } from 'lucide-angular';

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [InputComponent, NgFor, NgIf, LucideAngularModule],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.scss',
})
export class NewChatComponent implements OnInit {
  @Output() newMessageOut = new EventEmitter<{
    message: string;
    modelName: string;
    style: string;
  }>();
  readonly Info = Info;

  readonly styles = [
    { value: 'concise', label: 'Concise' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'detailed', label: 'In-depth' },
  ];
  selectedStyle = localStorage.getItem('style') || 'balanced';

  readonly modelDescriptions: Record<string, string> = {
    'llama-3.1-8b-instant': 'Fast and lightweight, great for quick responses',
    'llama-3.3-70b-versatile':
      'Powerful and versatile, excels at complex reasoning',
    'openai/gpt-oss-120b':
      'Frontier-scale intelligence for the most demanding tasks',
    'openai/gpt-oss-20b': 'Efficient and capable, balances speed with quality',
    'groq/compound':
      'Multi-model pipeline for accurate and comprehensive answers',
    'groq/compound-mini':
      'Faster compound model for quick, reliable everyday tasks',
  };

  models: Model[] = [];
  selectedModelName = localStorage.getItem('model') || '';

  constructor(private modelsService: ModelsService) {}

  async ngOnInit() {
    this.models = await firstValueFrom(this.modelsService.getModels());
    if (!this.selectedModelName && this.models.length > 0) {
      this.selectedModelName = this.models[0].modelName;
    }
  }

  get selectedModel(): Model | undefined {
    return this.models.find((m) => m.modelName === this.selectedModelName);
  }

  get selectedStyleLabel(): string {
    return this.styles.find((s) => s.value === this.selectedStyle)?.label ?? '';
  }

  selectModel(model: Model) {
    this.selectedModelName = model.modelName;
  }

  onSend(message: string) {
    this.newMessageOut.emit({
      message,
      modelName: this.selectedModelName,
      style: this.selectedStyle,
    });
  }
}
