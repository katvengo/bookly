import { Component, signal, input, effect, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';
import { getCurrentUser } from 'aws-amplify/auth';
import { UserServiceService } from './shared/services/user-service/user-service.service';
import { APP_TITLE, APP_DESCRIPTION } from './shared/constants/common';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = APP_TITLE;
  description = APP_DESCRIPTION;
  userService = inject(UserServiceService);
  isAuthenticated = signal<boolean>(false);

  async ngOnInit(): Promise<void> {
    const userInfo = await this.userService.getUser()
    console.log(userInfo, 'user info in app ts')
    if(userInfo.username) {
      this.isAuthenticated.set(true)
    } else {
      this.isAuthenticated.set(false)
    }
  }

  constructor() {
    effect(() => {
       this.userService.getUser()
    })
  }
}
