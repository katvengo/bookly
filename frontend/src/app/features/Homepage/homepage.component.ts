import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Card } from '@/shared/components/base/card/card';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { FormComponent } from '@/shared/components/form/form.component';
import { UserModel } from '@/shared/interfaces/UserModel';

@Component({
  selector: 'app-custom-component',
  standalone: true,
  imports: [CommonModule, Card, ButtonComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  private readonly router = inject(Router);
  username = signal('');
  constructor() {

  }

  async ngOnInit(): Promise<void> {
    try {
      const user = await getCurrentUser();
      this.username.set(user.signInDetails?.loginId ?? user.username);
    } catch {
      this.username.set('');
    }
  }

  async logOut(): Promise<void> {
    await signOut();
    await this.router.navigateByUrl('/login');
  }
}
