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
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth'
import outputs from '../../../../../amplify_outputs.json';
import { createAmplifyContext } from 'aws-amplify';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [InputComponent, FormField, FormRoot, ButtonComponent]
})
export class FormComponent  {
profile = createAmplifyContext(outputs);

showSignUpForm = signal(true);
showLoginForm = signal(false);
showConfirmationForm = signal(false);

signUpModel = signal({name: '', email: '', password: ''});
signUpForm = form(this.signUpModel, (schemaPath) => {
  required(schemaPath.email, {message: 'Email is required'});
  email(schemaPath.email, {message: 'Enter a valid email address'});

  required(schemaPath.password, {message: 'Password is required'});
});
loginModel = signal({email: '', password: ''});
loginForm = form(this.loginModel, (schemaPath) => {
  required(schemaPath.email, {message: 'Email is required'});
  email(schemaPath.email, {message: 'Enter a valid email address'});

  required(schemaPath.password, {message: 'Password is required'});
});
confirmationModel = signal({username: '', confirmation_number: ''});
confirmationForm = form(this.confirmationModel, (schemaPath) => {
  required(schemaPath.confirmation_number, {message: 'Confirmation code is required'});
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

async onLoginSubmit() {
  console.log('Login form submitted successfully:', this.loginModel());
  await this.onLogin(this.loginModel().email, this.loginModel().password);
}

async onSignUp() {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: this.userInfo()?.name ?? '', // Cognito uses username or email depending on config
      password: this.userInfo()?.password,
      options: {
        userAttributes: {
          email: this.userInfo()?.email // Required attribute
        }
      }
    });
    console.log('Sign up response:', { isSignUpComplete, userId, nextStep });
    console.log('Sign up successful, next step:', nextStep);
    if(nextStep) {
      this.showSignUpForm.set(false);
      this.showConfirmationForm.set(true);
    }
    // Pro-tip: Next step is typically 'CONFIRM_SIGN_UP' (verifying email code)
  } catch (error: any) {
    console.log('Sign up error:', error);
    this.errorMessage.set(error.message);
  }
}

async onLogin(email: string, password: string) {
  try {
    const user = await signIn(this.profile, {username: email, password: password});
    console.log('Login successful:', user);
  } catch (error: any) {
    console.log('Login error:', error);
    this.errorMessage.set(error.message);
  }
}
async onConfirmationSubmit() {
  console.log('Confirmation form submitted with:', this.userInfo()?.email, this.confirmationModel().confirmation_number);
  try {
    if(this.userInfo()?.email !== '' && this.confirmationModel().confirmation_number !== '') {
    const signUp = await confirmSignUp({
        username: this.userInfo()?.email ?? '', // Cognito uses username or email depending on config
        confirmationCode: this.confirmationModel().confirmation_number
      });

  console.log('Confirmation successful:', signUp);
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