import { Routes } from '@angular/router';
import { authGuard } from '@/auth/auth.guard';
import { LoginComponent } from '@/core/login/login.component';
import { HomepageComponent } from '@/features/Homepage/homepage.component';
import { UnauthenticatedComponent } from '@/features/Unauthenticated/Unauthenticated.component';

export const routes: Routes = [
  { path: '', component: UnauthenticatedComponent },
  { path: '', component: HomepageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
