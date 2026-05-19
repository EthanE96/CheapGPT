import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor } from '@angular/common';
import { ModelsService } from '../../../services/models.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Model } from '../../../models/model.model';

@Component({
  selector: 'app-llm-model-settings',
  standalone: true,
  imports: [AsyncPipe, NgFor, FormsModule],
  templateUrl: './llm-model-settings.component.html',
  styleUrl: './llm-model-settings.component.scss',
})
export class LlmModelSettingsComponent implements OnInit {
  models$: Observable<Model[]> = this.modelsService.getModels();
  selectedModelId = localStorage.getItem('model') || '';

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
}
