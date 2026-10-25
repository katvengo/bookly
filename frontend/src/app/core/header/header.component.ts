import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { APP_TITLE, APP_DESCRIPTION } from '@/shared/constants/common';
import { UserServiceService } from '@/shared/services/user-service/user-service.service';
import { InputComponent } from '@/shared/components/input/input.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [InputComponent]
})
export class HeaderComponent implements OnInit {
  title = APP_TITLE;
  description = APP_DESCRIPTION;
  userService = inject(UserServiceService);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    effect(async () => {
       this.userService.getUser()
       const userInfo = await this.userService.getUser()
       if(userInfo.username) {
         this.isAuthenticated.set(true)
       } else {
         this.isAuthenticated.set(false)
       }
    })
  }

  ngOnInit() {
  }

}
