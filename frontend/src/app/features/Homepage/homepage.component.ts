import { Component, OnInit, inject, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '@/shared/components/base/card/card';
import { FormComponent } from '@/shared/components/form/form.component';
import { getCurrentUser } from 'aws-amplify/auth';
import { firstValueFrom } from 'rxjs';


export interface UserModel {
  name: string;
  email: string;
  password: string;
}
@Component({
  selector: 'app-custom-component',
  standalone: true,
  imports: [CommonModule, Card, FormComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  userInfo = model<UserModel>();
  errorMessage = signal<string>('');
  constructor() {

  }

  ngOnInit(): void {
    // Initialization logic here
    this.getCurrentUserInfo();
  }

  async getCurrentUserInfo() {
    const { username, userId, signInDetails } = await getCurrentUser();

    console.log("username", username);
    console.log("user id", userId);
    console.log("sign-in details", signInDetails);
  }

}
