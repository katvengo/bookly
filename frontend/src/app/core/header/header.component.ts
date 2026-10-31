import { Component, inject } from '@angular/core';
import { APP_TITLE, APP_DESCRIPTION } from '@/shared/constants/common';
import { InputComponent } from '@/shared/components/input/input.component';
import { AuthServiceService } from '@/shared/services/auth-service/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [InputComponent]
})
export class HeaderComponent {
  title = APP_TITLE;
  description = APP_DESCRIPTION;
  private readonly auth = inject(AuthServiceService);
  readonly isAuthenticated = this.auth.isAuthenticated;
}
