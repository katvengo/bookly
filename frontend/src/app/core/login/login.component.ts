import { Component } from '@angular/core';
import { Card } from '@/shared/components/base/card/card';
import { FormComponent } from '@/shared/components/form/form.component';
import { APP_TITLE, APP_DESCRIPTION } from '@/shared/constants/common';
@Component({
  selector: 'app-login',
  imports: [Card, FormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
title = APP_TITLE;
description = APP_DESCRIPTION;
}
