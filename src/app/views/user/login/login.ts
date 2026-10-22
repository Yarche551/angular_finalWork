import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { PasswordToggle } from '../../../shared/components/password-toggle/password-toggle';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { getReturnUrl } from '../../../shared/utils/return-url';
import { EMAIL_PATTERN } from '../../../shared/utils/validation';
import { LoginResponseType } from '../../../types/login-response.type';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, PasswordToggle],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly showPassword = signal(false);
  protected readonly loading = signal(false);
  protected readonly serverError = signal('');
  protected readonly returnUrl = getReturnUrl(this.route);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  isInvalid(name: 'email' | 'password'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.dirty || control.touched);
  }

  isValid(name: 'email' | 'password'): boolean {
    const control = this.form.controls[name];
    return control.valid && control.dirty;
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.form.getRawValue();
    this.loading.set(true);
    this.serverError.set('');

    this.authService.login(email, password, rememberMe).subscribe({
      next: (data) => this.onSuccess(data),
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        const message = error.error?.message ?? 'Ошибка при авторизации';
        this.serverError.set(message);
        this.snackbar.error(message);
      },
    });
  }

  private onSuccess(data: LoginResponseType): void {
    this.loading.set(false);
    if (!data.accessToken || !data.refreshToken || !data.userId) {
      this.serverError.set('Ошибка при авторизации');
      return;
    }
    this.authService.setTokens(data.accessToken, data.refreshToken);
    this.authService.userId = data.userId;
    this.authService.loadUserInfo();
    this.snackbar.open('Вы успешно авторизовались');
    this.router.navigateByUrl(this.returnUrl);
  }
}
