import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  //  Updates the currentUserSubject and redirects to the home page
  checkAuthStatus(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.http
        .get<{ authenticated: boolean; user: User }>(
          `${this.baseURL}/auth/status`,
          { withCredentials: true }
        )
        .subscribe({
          next: (response) => {
            if (response.authenticated) {
              // Update the currentUserSubject
              this.currentUserSubject.next(response.user);
              // Redirect to the home page if not already (should already)
              if (this.router.url === '/login') {
                this.router.navigate(['/']);
              }
              resolve();
            } else {
              this.handleUnauthenticated();
              resolve();
            }
          },
          error: () => {
            this.handleUnauthenticated();
            resolve();
          },
        });
    });
  }

  // Redirects to the google login page
  loginWithGoogle(): void {
    window.location.href = `${this.baseURL}/auth/google`;
  }

  // Logs the user out
  logout(): void {
    this.http
      .get(`${this.baseURL}/auth/logout`, { withCredentials: true })
      .subscribe(() => {
        this.currentUserSubject.next(null);
      });
  }

  // Updates the currentUserSubject and redirects to the login page
  handleUnauthenticated(): void {
    // Update the currentUserSubject
    this.currentUserSubject.next(null);
    // Redirect to the login page
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  // Checks if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}
