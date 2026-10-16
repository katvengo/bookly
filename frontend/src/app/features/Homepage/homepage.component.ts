import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Card } from '@/shared/components/base/card/card';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { APP_TITLE, APP_DESCRIPTION } from '@/shared/constants/common';
@Component({
  selector: 'app-custom-component',
  standalone: true,
  imports: [CommonModule, Card, ButtonComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  title = APP_TITLE;
  description = APP_DESCRIPTION;

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
