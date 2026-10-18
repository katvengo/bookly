import { Injectable } from '@angular/core';
import { getCurrentUser } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  /**
   * True when the Amplify session configured in main.ts has a signed-in Cognito user.
   * A missing session is logged-out, not an application error.
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
}
