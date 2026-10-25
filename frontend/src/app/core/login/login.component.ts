import { Component, inject, signal, } from '@angular/core';
import { Card } from '@/shared/components/base/card/card';
import { APP_TITLE, APP_DESCRIPTION } from '@/shared/constants/common';
import { InputComponent } from '@/shared/components/input/input.component';
import {
  email,
  form,
  FormField,
  FormRoot,
  required,
} from '@angular/forms/signals';
import {RouterLink} from '@angular/router';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { UserModel } from '@/shared/interfaces/UserModel';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [Card, InputComponent, FormField, FormRoot, ButtonComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly router = inject(Router);

  title = APP_TITLE;
  description = APP_DESCRIPTION;
  loginModel = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });

    required(schemaPath.password, { message: 'Password is required' });
  });

  errorMessage = signal<string>('');
  async onLoginSubmit() {
    console.log('Login form submitted successfully:', this.loginModel());
    await this.onLogin(this.loginModel().email, this.loginModel().password);
  }

  async onLogin(email: string, password: string) {
    try {
      const result = await signIn({ username: email, password });
      console.log('Login successful:', result);
      if (result.isSignedIn) {
        await this.router.navigateByUrl('/');
        return;
      }
      this.errorMessage.set(`Additional step required: ${result.nextStep.signInStep}`);
    } catch (error: any) {
      console.log('Login error:', error);
      this.errorMessage.set(error.message);
    }
  }
}
