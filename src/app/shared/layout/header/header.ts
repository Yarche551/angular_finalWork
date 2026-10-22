import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Logo } from '../../components/logo/logo';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { SnackbarService } from '../../services/snackbar.service';
import { CONTACTS, MENU } from '../../utils/menu';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Logo, ClickOutsideDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    '(document:keydown.escape)': 'closeAll()',
  },
})
export class Header {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  protected readonly menu = MENU;
  protected readonly contacts = CONTACTS;
  protected readonly profileOpen = signal(false);
  protected readonly mobileMenuOpen = signal(false);

  toggleProfile(): void {
    this.profileOpen.update((open) => !open);
  }

  closeAll(): void {
    this.profileOpen.set(false);
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.profileOpen.set(false);
    this.authService.logout().subscribe({
      next: () => this.doLogout(),
      error: () => this.doLogout(),
    });
  }

  private doLogout(): void {
    this.authService.removeTokens();
    this.snackbar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
