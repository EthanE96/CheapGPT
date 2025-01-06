import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { ArrowRight, LucideAngularModule } from 'lucide-angular';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, LucideAngularModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly ArrowRight = ArrowRight;

  constructor(private router: Router) {}

  onGetStarted() {
    this.router.navigate(['/login']);
  }
}
