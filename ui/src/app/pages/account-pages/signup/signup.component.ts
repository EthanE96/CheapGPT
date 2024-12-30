import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  constructor(private authService: AuthService) {}

  signupWithGoogle() {
    this.authService.loginWithGoogle();
  }
  signupWithGitHub() {
    this.authService.loginWithGithub();
  }
}
