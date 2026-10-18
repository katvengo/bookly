import { Component } from '@angular/core';
import { Card } from '@/shared/components/base/card/card';
import { FormComponent } from '@/shared/components/form/form.component';

@Component({
  selector: 'app-login',
  imports: [Card, FormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class SignUpComponent {

}
