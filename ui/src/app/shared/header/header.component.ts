import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  LucideAngularModule,
  PanelLeftOpen,
  Settings,
  Sun,
  Moon,
  LogIn,
} from 'lucide-angular';
import { Router } from '@angular/router';
import { LlmModelSettingsComponent } from '../../pages/layout/llm-model-settings/llm-model-settings.component';
import { ThemeComponent } from '../theme/theme.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule, LlmModelSettingsComponent, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly PanelLeftOpen = PanelLeftOpen;
  readonly Settings = Settings;
  readonly Sun = Sun;
  readonly Moon = Moon;
  readonly LogIn = LogIn;

  @Input() isDrawerOpen: boolean = true;
  @Input() isInfoMode: boolean = false;
  @Output() isDrawerOpenChange = new EventEmitter();

  currentTheme = this.themeComponent.currentTheme;
  imgTheme = this.currentTheme === 'dark' ? Sun : Moon;
  logo = this.themeComponent.logo;

  constructor(private router: Router, private themeComponent: ThemeComponent) {}

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }

  onThemeToggle() {
    this.currentTheme = this.themeComponent.toggleTheme();
    this.logo = this.themeComponent.logo;
    this.imgTheme = this.currentTheme === 'dark' ? Sun : Moon;
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }

  onLogout() {
    this.router.navigate(['/logout']);
  }

  onApp() {
    this.router.navigate(['/app']);
  }

  onHome() {
    this.router.navigate(['/']);
  }
}
