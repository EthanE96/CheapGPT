import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-llm-model-settings',
  standalone: true,
  imports: [],
  templateUrl: './llm-model-settings.component.html',
  styleUrl: './llm-model-settings.component.scss',
})
export class LlmModelSettingsComponent {
  @Output() modelChange = new EventEmitter();

  model = {
    key: '',
    model: '',
  };

  onSave(key: string, model: string) {
    this.model.key = key;
    this.model.model = model;
    this.modelChange.emit(this.model);
  }
}
