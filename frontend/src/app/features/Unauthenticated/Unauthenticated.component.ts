import { APP_TITLE, APP_DESCRIPTION } from '@/shared/constants/common';
import { Component, inject, OnInit } from '@angular/core';
import { Card } from '@/shared/components/base/card/card';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import {RouterLink, Router} from '@angular/router';

@Component({
  selector: 'app-Unauthenticated',
  templateUrl: './Unauthenticated.component.html',
  styleUrls: ['./Unauthenticated.component.scss'],
  imports: [Card, ButtonComponent, CommonModule, RouterLink],
})
export class UnauthenticatedComponent implements OnInit {
  title = APP_TITLE;
  description = APP_DESCRIPTION;
  router = inject(Router);
  constructor() { }

  ngOnInit() {
  }

  onLogin() {
    console.log('Navigating to login page...');
    this.router.navigate(['login']);
  }

}
