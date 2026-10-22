import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponseType } from '../../types/default-response.type';
import { LoginResponseType } from '../../types/login-response.type';
import { UserInfoType } from '../../types/user-info.type';

@Injectable({ providedIn: 'root' })
export class AuthService {
  static readonly accessTokenKey = 'accessToken';
  static readonly refreshTokenKey = 'refreshToken';
  static readonly userIdKey = 'userId';

  private readonly http = inject(HttpClient);
  private refreshRequest$: Observable<LoginResponseType> | null = null;

  readonly isLogged = signal<boolean>(!!localStorage.getItem(AuthService.accessTokenKey));
  readonly userInfo = signal<UserInfoType | null>(null);
  readonly userName = computed(() => this.userInfo()?.name ?? '');

  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponseType> {
    return this.http.post<LoginResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe,
    });
  }

  signup(name: string, email: string, password: string): Observable<LoginResponseType> {
    return this.http.post<LoginResponseType>(environment.api + 'signup', {
      name,
      email,
      password,
    });
  }

  logout(): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'logout', {
      refreshToken: this.getTokens().refreshToken,
    });
  }

  // Один общий запрос на обновление токенов, даже если 401 пришёл сразу на несколько запросов
  refresh(): Observable<LoginResponseType> {
    if (!this.refreshRequest$) {
      this.refreshRequest$ = this.http
        .post<LoginResponseType>(environment.api + 'refresh', {
          refreshToken: this.getTokens().refreshToken,
        })
        .pipe(
          tap((tokens) => this.setTokens(tokens.accessToken, tokens.refreshToken)),
          finalize(() => (this.refreshRequest$ = null)),
          shareReplay(1),
        );
    }
    return this.refreshRequest$;
  }

  loadUserInfo(): void {
    this.http.get<UserInfoType>(environment.api + 'users').subscribe({
      next: (user) => this.userInfo.set(user),
      error: () => this.userInfo.set(null),
    });
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(AuthService.accessTokenKey, accessToken);
    localStorage.setItem(AuthService.refreshTokenKey, refreshToken);
    this.isLogged.set(true);
  }

  removeTokens(): void {
    localStorage.removeItem(AuthService.accessTokenKey);
    localStorage.removeItem(AuthService.refreshTokenKey);
    localStorage.removeItem(AuthService.userIdKey);
    this.isLogged.set(false);
    this.userInfo.set(null);
  }

  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(AuthService.accessTokenKey),
      refreshToken: localStorage.getItem(AuthService.refreshTokenKey),
    };
  }

  get userId(): string | null {
    return localStorage.getItem(AuthService.userIdKey);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(AuthService.userIdKey, id);
    } else {
      localStorage.removeItem(AuthService.userIdKey);
    }
  }
}
