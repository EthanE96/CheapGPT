import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FooterComponent, HeaderComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  logo = this.theme.logo;
  constructor(
    private authService: AuthService,
    private theme: ThemeComponent
  ) {}

  signupWithGoogle() {
    this.authService.loginWithGoogle();
  }
  signupWithGitHub() {
    this.authService.loginWithGithub();
  }
}
