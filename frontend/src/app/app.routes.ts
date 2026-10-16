import { Routes } from '@angular/router';
import { authGuard } from '@/auth/auth.guard';
import { LoginComponent } from '@/core/login/login.component';
import { HomepageComponent } from '@/features/Homepage/homepage.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomepageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
