import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  // Inject services inside the function
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is authenticated
  return authService.isAuthenticated().pipe(
    map((status: number) => {
      if (status === 200) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError((error) => {
      router.navigate(['/login']);
      return of(error); // Return false to prevent navigation
    })
  );
};
