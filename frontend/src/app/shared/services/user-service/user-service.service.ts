import { UserModel } from '@/shared/interfaces/UserModel';
import { Injectable, signal } from '@angular/core';
import { getCurrentUser } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
private username = signal<string | null>(null)
#username = this.username.asReadonly();


async getUser() {
  console.log('Calling getUser in UserServiceService')
  try {
    const { username, userId, signInDetails } = await getCurrentUser();

    console.log("username", username);
    console.log("user id", userId);
    console.log("sign-in details", signInDetails);
    return { username, userId, signInDetails };
    // this.username.set(usernamer.?.loginId ?? user.username);
  } catch(error) {
    console.log("Error getting current user:", error);
    this.username.set('');
    return {
      statusCode: 401,
      status: 'Unauthorized',
      error
    }
  }
}

getUserName() {
  return this.#username();
}
}
