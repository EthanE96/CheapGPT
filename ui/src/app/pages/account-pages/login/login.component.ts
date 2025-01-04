import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  logo = this.theme.logo;
  constructor(
    private authService: AuthService,
    private theme: ThemeComponent
  ) {}

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithGitHub() {
    this.authService.loginWithGithub();
  }
}
