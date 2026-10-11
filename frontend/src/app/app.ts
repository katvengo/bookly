import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './shared/components/button/button.component';
import { InputComponent } from './shared/components/input/input.component';
import { FormComponent } from './shared/components/form/form.component';
@Component({
  selector: 'app-root',
  imports: [ButtonComponent, CommonModule, InputComponent, FormComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');

  constructor() {
    console.log('App component initialized');
  }
}
