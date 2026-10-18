import { APP_TITLE, APP_DESCRIPTION } from '@/shared/constants/common';
import { Component, OnInit } from '@angular/core';
import { Card } from '@/shared/components/base/card/card';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-Unauthenticated',
  templateUrl: './Unauthenticated.component.html',
  styleUrls: ['./Unauthenticated.component.scss'],
  imports: [Card, ButtonComponent, CommonModule],
})
export class UnauthenticatedComponent implements OnInit {
  title = APP_TITLE;
  description = APP_DESCRIPTION;
  constructor() { }

  ngOnInit() {
  }

}
