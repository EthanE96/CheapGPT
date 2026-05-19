import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { InputComponent } from '../../../shared/input/input.component';
import { ModelsService } from '../../../services/models.service';
import { Model } from '../../../models/model.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [InputComponent, NgFor, NgIf],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.scss',
})
export class NewChatComponent implements OnInit {
  @Output() newMessageOut = new EventEmitter<{ message: string; modelName: string }>();

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

  selectModel(model: Model) {
    this.selectedModelName = model.modelName;
  }

  onSend(message: string) {
    this.newMessageOut.emit({ message, modelName: this.selectedModelName });
  }
}
