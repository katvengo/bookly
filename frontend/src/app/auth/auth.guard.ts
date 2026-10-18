import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '@/shared/services/auth-service/auth-service.service';

/** Allows the route only when Cognito has a current signed-in user. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthServiceService);
  const router = inject(Router);
  const loggedIn = await auth.isLoggedIn();

  if (loggedIn) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
