import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authConfig } from './auth/auth.config';
import { provideAuth } from 'angular-auth-oidc-client';
import { AuthServiceService } from './shared/services/auth-service/auth-service.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAuth(authConfig),
    provideAppInitializer(() => inject(AuthServiceService).isLoggedIn()),
  ],
};
