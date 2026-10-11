import { Component, input, model, output } from '@angular/core';
import {
  FormValueControl,
  WithOptionalFieldTree,
  ValidationError,
  DisabledReason,
} from '@angular/forms/signals';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements FormValueControl<string> {
value = model<string>('');

touched = input<boolean>(false);
touch = output<void>();

type = input<string>('text');
id = input<number | null>(null);
name = input<string>('');
placeholder = input<string>('');
disabled = input<boolean>(false);
readonly = input<boolean>(false);
invalid = input<boolean>(false);
}
