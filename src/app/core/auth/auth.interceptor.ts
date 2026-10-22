import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const withToken = (req: HttpRequest<unknown>, token: string) =>
  req.clone({ headers: req.headers.set('x-auth', token) });

const isAuthRequest = (url: string) =>
  ['/login', '/signup', '/refresh', '/logout'].some((path) => url.endsWith(path));

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const { accessToken } = authService.getTokens();

  if (!accessToken || isAuthRequest(req.url)) {
    return next(req);
  }

  return next(withToken(req, accessToken)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // access-токен протух: обновляем пару токенов и повторяем исходный запрос
      return authService.refresh().pipe(
        catchError((refreshError: HttpErrorResponse) => {
          authService.removeTokens();
          return throwError(() => refreshError);
        }),
        switchMap((tokens) => next(withToken(req, tokens.accessToken))),
      );
    }),
  );
};
