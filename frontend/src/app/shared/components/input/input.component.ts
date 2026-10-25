import { Component, input, model, output } from '@angular/core';
import {
  FormValueControl,
} from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [CommonModule],
})
export class InputComponent implements FormValueControl<string> {
value = model<string>('');
variant = input<string>('primary');
touched = input<boolean>(false);
touch = output<void>();

type = input<string>('text');
id = input<number | null>(null);
name = input<string>('');
placeholder = input<string>('');
disabled = input<boolean>(false);
readonly = input<boolean>(false);
invalid = input<boolean>(false);
isError = input<boolean>(false);
isFocused = model<boolean>(false);
isHovered = model<boolean>(false);

onBlur(event: any) {
  console.log('InputComponent onBlur', event);
}
}
