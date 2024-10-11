import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ModalSettingsComponent } from '../../shared/modal-settings/modal-settings.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ChatComponent, ModalSettingsComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  onModelChange(model: unknown) {
    console.log('model changed');
    console.log(model);
  }
}
