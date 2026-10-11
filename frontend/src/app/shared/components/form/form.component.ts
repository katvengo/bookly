import { Component, OnInit, signal } from '@angular/core';
import { InputComponent } from '../input/input.component';
import {form, FormField, required, email} from '@angular/forms/signals';
import { ButtonComponent } from '../button/button.component';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [InputComponent, FormField, ButtonComponent]
})
export class FormComponent implements OnInit {
loginModel = signal({name: '', email: ''});
loginForm = form(this.loginModel, (schemaPath) => {
  required(schemaPath.email, {message: 'Email is required'});
  email(schemaPath.email, {message: 'Enter a valid email address'});
});

constructor() { }

  ngOnInit() {
  }

}
