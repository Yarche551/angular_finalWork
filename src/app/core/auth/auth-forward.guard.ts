import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Авторизованному пользователю нечего делать на страницах входа и регистрации
export const authForwardGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLogged() ? router.createUrlTree(['/']) : true;
};
