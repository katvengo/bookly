import { Component, signal, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
  navbar = input<boolean>(false);

  constructor() {
    effect(() => {

    });
}
}
