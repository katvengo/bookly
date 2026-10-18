import { Routes } from '@angular/router';
import { loggedInMatch, loggedOutMatch } from '@/auth/auth.guard';
import { LoginComponent } from '@/core/login/login.component';
import { SignUpComponent } from '@/core/signUp/signup.component';
import { HomepageComponent } from '@/features/Homepage/homepage.component';
import { UnauthenticatedComponent } from '@/features/Unauthenticated/Unauthenticated.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomepageComponent, canMatch: [loggedInMatch] },
  { path: '', pathMatch: 'full', component: UnauthenticatedComponent, canMatch: [loggedOutMatch] },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: '**', redirectTo: '' },
];
