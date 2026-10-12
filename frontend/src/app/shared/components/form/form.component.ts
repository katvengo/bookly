import { Component, OnInit, signal, model } from '@angular/core';
import { InputComponent } from '../input/input.component';
import {
  email,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
  submit,} from '@angular/forms/signals';
import { ButtonComponent } from '../button/button.component';
import { UserModel } from '@/features/Homepage/homepage.component';
import { signUp } from 'aws-amplify/auth';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [InputComponent, FormField, FormRoot, ButtonComponent]
})
export class FormComponent implements OnInit {

loginModel = signal({name: '', email: '', password: ''});
loginForm = form(this.loginModel, (schemaPath) => {
  required(schemaPath.email, {message: 'Email is required'});
  email(schemaPath.email, {message: 'Enter a valid email address'});

  required(schemaPath.password, {message: 'Password is required'});
});
userInfo = model<UserModel>();
errorMessage = signal<string>('');

constructor() { }

  ngOnInit() {
  }

async onSubmit() {
  console.log('Form submitted successfully:', this.loginModel());
  this.userInfo.set(this.loginModel());
  console.log('User info set:', this.userInfo());
  await this.onSignUp();
}

async onSignUp() {
  const email = this.userInfo()?.email ?? '';
  const password = this.userInfo()?.password ?? '';
  if (!email || !password) {
    this.errorMessage.set('Email and password are required');
    return;
  }

  try {
    const { nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
    console.log('Sign up successful, next step:', nextStep);
    // Pro-tip: Next step is typically 'CONFIRM_SIGN_UP' (verifying email code)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'NoAmplifyContextError') {
      this.errorMessage.set(
        'Amplify is not configured. Generate frontend/public/amplify_outputs.json with "npm run sandbox", then reload.',
      );
      return;
    }
    this.errorMessage.set(error instanceof Error ? error.message : 'Sign up failed');
  }
}
}
