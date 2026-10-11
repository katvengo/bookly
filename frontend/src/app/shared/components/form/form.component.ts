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
import { Amplify } from 'aws-amplify';
import { signIn, signUp } from 'aws-amplify/auth'
import outputs from '../../../../../../amplify/auth/amplify_outputs.json';
Amplify.configure(outputs);

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
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: this.userInfo()?.email ?? '', // Cognito uses username or email depending on config
      password: this.userInfo()?.password,
      options: {
        userAttributes: {
          email: this.userInfo()?.email // Required attribute
        }
      }
    });
    console.log('Sign up successful, next step:', nextStep);
    // Pro-tip: Next step is typically 'CONFIRM_SIGN_UP' (verifying email code)
  } catch (error: any) {
    this.errorMessage.set(error.message);
  }
}
}
