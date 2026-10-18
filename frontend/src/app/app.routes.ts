import { Routes } from '@angular/router';
import { authGuard } from '@/auth/auth.guard';
import { LoginComponent } from '@/core/login/login.component';
import { SignUpComponent } from '@/core/signUp/signup.component';
import { HomepageComponent } from '@/features/Homepage/homepage.component';
import { UnauthenticatedComponent } from '@/features/Unauthenticated/Unauthenticated.component';

export const routes: Routes = [
  { path: '', component: UnauthenticatedComponent, canActivate: [authGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: '', component: HomepageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
