import { Component, signal, input, effect, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';
import { getCurrentUser } from 'aws-amplify/auth';
import { UserServiceService } from './shared/services/user-service/user-service.service';
import { APP_TITLE, APP_DESCRIPTION } from './shared/constants/common';
import { HeaderComponent } from './core/header/header.component';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

}
