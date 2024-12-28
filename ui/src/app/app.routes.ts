import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { SignupComponent } from './pages/account/signup/signup.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { LoginComponent } from './pages/account/login/login.component';
import { LogoutComponent } from './pages/account/logout/logout.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', component: LayoutComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'logout', component: LogoutComponent },

  // wildcard route for a 404
  { path: '**', component: NotFoundComponent },
];
