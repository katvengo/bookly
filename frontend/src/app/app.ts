import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './core/header/header.component';
import { AuthServiceService } from './shared/services/auth-service/auth-service.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly auth = inject(AuthServiceService);
  private readonly router = inject(Router);
  readonly isAuthenticated = this.auth.isAuthenticated;

  constructor() {
    void this.auth.isLoggedIn();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        void this.auth.isLoggedIn();
      });
  }
}
