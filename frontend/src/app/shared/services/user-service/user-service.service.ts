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
  try {
    const { username, userId, signInDetails } = await getCurrentUser();
    this.username.set(username);
    return { username, userId, signInDetails };
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
