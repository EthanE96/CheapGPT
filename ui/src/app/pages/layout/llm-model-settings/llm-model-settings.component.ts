import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ModelsService } from '../../../services/models.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Model } from '../../../models/model.model';

@Component({
  selector: 'app-llm-model-settings',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, FormsModule],
  templateUrl: './llm-model-settings.component.html',
  styleUrl: './llm-model-settings.component.scss',
})
export class LlmModelSettingsComponent implements OnInit {
  models$: Observable<Model[]> = this.modelsService.getModels();
  selectedModelId = localStorage.getItem('model') || '';
  selectedStyle = localStorage.getItem('style') || 'balanced';

  readonly styles = [
    { value: 'concise', label: 'Concise' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'detailed', label: 'In-depth' },
  ];

  readonly styleDescriptions: Record<string, string> = {
    concise: 'Short and to the point, skipping preamble and filler',
    balanced: 'Standard response length for everyday questions',
    detailed: 'Thorough and comprehensive, with context and examples',
  };

  readonly modelDescriptions: Record<string, string> = {
    'llama-3.1-8b-instant': 'Fast and lightweight, great for quick responses',
    'llama-3.3-70b-versatile': 'Powerful and versatile, excels at complex reasoning',
    'openai/gpt-oss-120b': 'Frontier-scale intelligence for the most demanding tasks',
    'openai/gpt-oss-20b': 'Efficient and capable, balances speed with quality',
    'groq/compound': 'Multi-model pipeline for accurate and comprehensive answers',
    'groq/compound-mini': 'Faster compound model for quick, reliable everyday tasks',
  };

  constructor(private modelsService: ModelsService) {}

  ngOnInit() {
    if (!this.selectedModelId) {
      this.models$.pipe(take(1)).subscribe((models) => {
        if (models.length > 0) {
          this.selectedModelId = models[0].modelName;
          localStorage.setItem('model', this.selectedModelId);
        }
      });
    }
  }

  onSave(model: string) {
    localStorage.setItem('model', model);
  }

  onSaveStyle(style: string) {
    localStorage.setItem('style', style);
  }
}
