import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor } from '@angular/common';
import { ModelsService } from '../../../services/models.service';
import { Observable } from 'rxjs';
import { Model } from '../../../models/model.model';

@Component({
  selector: 'app-llm-model-settings',
  standalone: true,
  imports: [AsyncPipe, NgFor, FormsModule],
  templateUrl: './llm-model-settings.component.html',
  styleUrl: './llm-model-settings.component.scss',
})
export class LlmModelSettingsComponent {
  models$: Observable<Model[]> = this.modelsService.getModels();
  selectedModelId = localStorage.getItem('model') || '';

  constructor(private modelsService: ModelsService) {}

  onSave(model: string) {
    localStorage.setItem('model', model);
  }
}
