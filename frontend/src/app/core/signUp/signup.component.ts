import { Component, inject, model, signal } from '@angular/core';
import { UserModel } from '@/shared/interfaces/UserModel';
import {
  email,
  form,
  FormField,
  FormRoot,
  required, } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { InputComponent } from '@/shared/components/input/input.component';
import { Card } from '@/shared/components/base/card/card';
@Component({
  selector: 'app-signup',
  imports: [Card, FormField, FormRoot, ButtonComponent, InputComponent, Card, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignUpComponent {
  private readonly router = inject(Router);
  showSignUpForm = signal(true);
  showLoginForm = signal(false);
  showConfirmationForm = signal(false);
  signUpModel = signal({ name: '', email: '', password: '' });

  signUpForm = form(this.signUpModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });

    required(schemaPath.password, { message: 'Password is required' });
  });

  confirmationModel = signal({ username: '', confirmation_number: '' });
  confirmationForm = form(this.confirmationModel, (schemaPath) => {
    required(schemaPath.confirmation_number, { message: 'Confirmation code is required' });
  });

  userInfo = model<UserModel>();
  errorMessage = signal<string>('');
  needsConfirmation = signal(false);

  async onSignUpSubmit() {
    console.log('Form submitted successfully:', this.signUpModel());
    this.userInfo.set(this.signUpModel());
    console.log('User info set:', this.userInfo());
    await this.onSignUp();
  }

  async onSignUp() {
    try {
      const accountEmail = this.userInfo()?.email ?? '';
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: accountEmail,
        password: this.userInfo()?.password,
        options: {
          userAttributes: {
            email: accountEmail,
          },
        },
      });
      console.log('Sign up response:', { isSignUpComplete, userId, nextStep });
      console.log('Sign up successful, next step:', nextStep);
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        this.showSignUpForm.set(false);
        this.showConfirmationForm.set(true);
        return;
      }
      if (isSignUpComplete) {
        this.showSignUpForm.set(false);
        this.showLoginForm.set(true);
      }
    } catch (error: any) {
      console.log('Sign up error:', error);
      this.errorMessage.set(error.message);
    }
  }


  async onConfirmationSubmit() {
    console.log('Confirmation form submitted with:', this.userInfo()?.email, this.confirmationModel().confirmation_number);
    try {
      if (this.userInfo()?.email !== '' && this.confirmationModel().confirmation_number !== '') {
        const signUp = await confirmSignUp({
          username: this.userInfo()?.email ?? '', // Cognito uses username or email depending on config
          confirmationCode: this.confirmationModel().confirmation_number
        });

        console.log('Confirmation successful:', signUp);
        this.showConfirmationForm.set(false);
        this.showLoginForm.set(true);
      }
    } catch (error: any) {
      console.log('Confirmation error:', error);
      this.errorMessage.set(error.message);
    }
  }

  async shouldShowLoginScreen() {
    this.showSignUpForm.set(false);
    this.showLoginForm.set(true);
  }

}
