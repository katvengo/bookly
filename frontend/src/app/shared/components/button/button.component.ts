import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
type = input<string>('text');
disabled = input<boolean>(false);
variant = input<string>('primary');

onClick() {
  console.log('Button clicked');
}

}
