import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { PasswordToggle } from '../../../shared/components/password-toggle/password-toggle';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { getReturnUrl } from '../../../shared/utils/return-url';
import { EMAIL_PATTERN, NAME_PATTERN, PASSWORD_PATTERN } from '../../../shared/utils/validation';
import { LoginResponseType } from '../../../types/login-response.type';

type SignupField = 'name' | 'email' | 'password' | 'agree';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, PasswordToggle],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
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
    name: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
    agree: [false, [Validators.requiredTrue]],
  });

  isInvalid(name: SignupField): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.dirty || control.touched);
  }

  isValid(name: SignupField): boolean {
    const control = this.form.controls[name];
    return control.valid && control.dirty;
  }

  signup(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.serverError.set('');

    this.authService.signup(name.trim(), email, password).subscribe({
      next: (data) => this.onSuccess(data),
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        const message = error.error?.message ?? 'Ошибка при регистрации';
        this.serverError.set(message);
        this.snackbar.error(message);
      },
    });
  }

  private onSuccess(data: LoginResponseType): void {
    this.loading.set(false);
    if (!data.accessToken || !data.refreshToken || !data.userId) {
      this.serverError.set('Ошибка при регистрации');
      return;
    }
    this.authService.setTokens(data.accessToken, data.refreshToken);
    this.authService.userId = data.userId;
    this.authService.loadUserInfo();
    this.snackbar.open('Вы успешно зарегистрировались');
    this.router.navigateByUrl(this.returnUrl);
  }
}
