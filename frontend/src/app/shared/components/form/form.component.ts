import { Component, model, signal } from '@angular/core';
import { InputComponent } from '../input/input.component';
import {
  email,
  form,
  FormField,
  FormRoot,
  required,
} from '@angular/forms/signals';
import { ButtonComponent } from '../button/button.component';
import { UserModel } from '@/features/Homepage/homepage.component';
import {
  confirmSignUp,
  resendSignUpCode,
  signIn,
  signUp,
} from 'aws-amplify/auth';

type AuthMode = 'signIn' | 'signUp' | 'confirmSignUp';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [InputComponent, FormField, FormRoot, ButtonComponent],
})
export class FormComponent {
  mode = signal<AuthMode>('signIn');

  loginModel = signal({ name: '', email: '', password: '', confirmationCode: '' });
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  userInfo = model<UserModel>();
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  busy = signal(false);

  setMode(next: AuthMode): void {
    this.mode.set(next);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set('');
    this.successMessage.set('');
    this.userInfo.set(this.loginModel());

    const current = this.mode();
    if (current === 'signIn') {
      await this.onSignIn();
      return;
    }
    if (current === 'signUp') {
      await this.onSignUp();
      return;
    }
    await this.onConfirmSignUp();
  }

  async onSignIn(): Promise<void> {
    const emailValue = this.loginModel().email.trim();
    const password = this.loginModel().password;
    if (!emailValue || !password) {
      this.errorMessage.set('Email and password are required');
      return;
    }

    this.busy.set(true);
    try {
      const { nextStep } = await signIn({
        username: emailValue,
        password,
      });

      if (nextStep.signInStep === 'DONE') {
        this.successMessage.set('Signed in successfully.');
        return;
      }

      if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        this.setMode('confirmSignUp');
        this.successMessage.set('Confirm your email with the code Cognito sent you.');
        return;
      }

      this.errorMessage.set(`Additional step required: ${nextStep.signInStep}`);
    } catch (error: unknown) {
      this.errorMessage.set(this.toAuthErrorMessage(error, 'Sign in failed'));
    } finally {
      this.busy.set(false);
    }
  }

  async onSignUp(): Promise<void> {
    const emailValue = this.loginModel().email.trim();
    const password = this.loginModel().password;
    if (!emailValue || !password) {
      this.errorMessage.set('Email and password are required');
      return;
    }

    this.busy.set(true);
    try {
      const { nextStep } = await signUp({
        username: emailValue,
        password,
        options: {
          userAttributes: {
            email: emailValue,
          },
        },
      });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        this.setMode('confirmSignUp');
        this.successMessage.set('Account created. Enter the confirmation code from your email.');
        return;
      }

      if (nextStep.signUpStep === 'DONE') {
        this.successMessage.set('Account created. You can sign in.');
        this.setMode('signIn');
        return;
      }

      this.successMessage.set(`Sign up next step: ${nextStep.signUpStep}`);
    } catch (error: unknown) {
      this.errorMessage.set(this.toAuthErrorMessage(error, 'Sign up failed'));
    } finally {
      this.busy.set(false);
    }
  }

  async onConfirmSignUp(): Promise<void> {
    const emailValue = this.loginModel().email.trim();
    const confirmationCode = this.loginModel().confirmationCode.trim();
    if (!emailValue || !confirmationCode) {
      this.errorMessage.set('Email and confirmation code are required');
      return;
    }

    this.busy.set(true);
    try {
      const { nextStep } = await confirmSignUp({
        username: emailValue,
        confirmationCode,
      });

      if (nextStep.signUpStep === 'DONE') {
        this.successMessage.set('Email confirmed. Sign in with your password.');
        this.setMode('signIn');
        return;
      }

      this.successMessage.set(`Confirmation next step: ${nextStep.signUpStep}`);
    } catch (error: unknown) {
      this.errorMessage.set(this.toAuthErrorMessage(error, 'Confirmation failed'));
    } finally {
      this.busy.set(false);
    }
  }

  async onResendCode(): Promise<void> {
    const emailValue = this.loginModel().email.trim();
    if (!emailValue) {
      this.errorMessage.set('Enter your email first');
      return;
    }

    this.busy.set(true);
    this.errorMessage.set('');
    try {
      await resendSignUpCode({ username: emailValue });
      this.successMessage.set('A new confirmation code was sent.');
    } catch (error: unknown) {
      this.errorMessage.set(this.toAuthErrorMessage(error, 'Could not resend code'));
    } finally {
      this.busy.set(false);
    }
  }

  submitLabel(): string {
    switch (this.mode()) {
      case 'signIn':
        return 'Sign In';
      case 'signUp':
        return 'Create an Account';
      case 'confirmSignUp':
        return 'Confirm Email';
    }
  }

  private toAuthErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.name === 'NoAmplifyContextError') {
      return 'Amplify is not configured. Generate frontend/public/amplify_outputs.json with "npm run sandbox", then reload.';
    }
    return error instanceof Error ? error.message : fallback;
  }
}
