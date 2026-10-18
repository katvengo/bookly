import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
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

/** Matches the route only for signed-in users, so another route with the same path can serve guests. */
export const loggedInMatch: CanMatchFn = () => inject(AuthServiceService).isLoggedIn();

/** Matches the route only for signed-out visitors. */
export const loggedOutMatch: CanMatchFn = async () =>
  !(await inject(AuthServiceService).isLoggedIn());
