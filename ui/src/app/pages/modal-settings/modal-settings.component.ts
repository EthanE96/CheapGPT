import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-settings',
  standalone: true,
  imports: [],
  templateUrl: './modal-settings.component.html',
  styleUrl: './modal-settings.component.scss',
})
export class ModalSettingsComponent {
  @Output() modelChange = new EventEmitter();

  constructor(private router: Router) {}

  model = {
    key: '',
    model: '',
  };

  onSave(key: string, model: string) {
    this.model.key = key;
    this.model.model = model;
    this.modelChange.emit(this.model);
  }

  onLogout() {
    this.modelChange.emit(null);
    this.router.navigate(['/logout']);
  }
}
