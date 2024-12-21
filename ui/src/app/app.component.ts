import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { themeChange } from 'theme-change';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CheapGPT';

  constructor() {
    themeChange();
  }
}
