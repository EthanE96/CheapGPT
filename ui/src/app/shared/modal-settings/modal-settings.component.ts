import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-settings',
  standalone: true,
  imports: [],
  templateUrl: './modal-settings.component.html',
  styleUrl: './modal-settings.component.scss',
})
export class ModalSettingsComponent {
  @Output() modelChange = new EventEmitter();

  model = {
    key: '',
    model: '',
  };

  save(key: string, model: string) {
    this.model.key = key;
    this.model.model = model;
    this.modelChange.emit(this.model);
  }
}
