import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { ArrowRight, LucideAngularModule } from 'lucide-angular';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ThemeComponent } from '../../shared/theme/theme.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    NgClass,
    NgOptimizedImage,
    LucideAngularModule,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly ArrowRight = ArrowRight;
  currentTheme = this.theme.currentTheme;

  constructor(private router: Router, private theme: ThemeComponent) {}

  onGetStarted() {
    this.router.navigate(['/login']);
  }

  onGetSourceCode() {
    window.open('https://github.com/EthanE96/CheapGPT', '_blank');
  }
}
