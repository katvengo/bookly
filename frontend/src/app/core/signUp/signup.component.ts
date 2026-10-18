import { Component } from '@angular/core';
import { Card } from '@/shared/components/base/card/card';
import { FormComponent } from '@/shared/components/form/form.component';

@Component({
  selector: 'app-signup',
  imports: [Card, FormComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignUpComponent {

}
