import { Injectable, signal } from '@angular/core';
import { getCurrentUser } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private readonly authenticated = signal(false);

  /**
   * Whether Cognito currently has a signed-in user.
   * Starts signed-out and updates whenever `isLoggedIn()` checks the session.
   */
  readonly isAuthenticated = this.authenticated.asReadonly();

  /**
   * True when the Amplify session configured in main.ts has a signed-in Cognito user.
   * A missing session is logged-out, not an application error.
   * Also updates `isAuthenticated` so the shell can show or hide signed-in UI.
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await getCurrentUser();
      this.authenticated.set(true);
      return true;
    } catch {
      this.authenticated.set(false);
      return false;
    }
  }
}
