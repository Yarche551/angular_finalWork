import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { setupRouterScroll } from './core/scroll/router-scroll';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  constructor() {
    setupRouterScroll();

    // после перезагрузки страницы подтягиваем имя пользователя для шапки
    const authService = inject(AuthService);
    if (authService.isLogged()) {
      authService.loadUserInfo();
    }
  }
}
