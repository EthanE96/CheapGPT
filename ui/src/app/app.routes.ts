import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { SignupComponent } from './pages/account-pages/signup/signup.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { LoginComponent } from './pages/account-pages/login/login.component';
import { LogoutComponent } from './pages/account-pages/logout/logout.component';
import { authGuard } from './guard/auth.guard';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'app', component: LayoutComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'logout', component: LogoutComponent },

  // wildcard route for a 404
  { path: '**', component: NotFoundComponent },
];
