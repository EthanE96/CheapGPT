import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink],
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
