import { Component, model } from '@angular/core';

// Кнопка «показать / скрыть пароль» внутри поля
@Component({
  selector: 'app-password-toggle',
  template: `
    <button
      type="button"
      class="password-toggle"
      [class.active]="visible()"
      [attr.aria-label]="visible() ? 'Скрыть пароль' : 'Показать пароль'"
      [attr.aria-pressed]="visible()"
      (click)="visible.set(!visible())"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" stroke-linejoin="round" />
        <circle cx="12" cy="12" r="3" />
        @if (!visible()) {
          <path d="M4 20 20 4" stroke-linecap="round" />
        }
      </svg>
    </button>
  `,
  styles: `
    @use 'variables' as *;

    :host {
      position: absolute;
      top: 0;
      right: 0;
    }

    .password-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 53px;
      padding: 0;
      border: 0;
      background: none;
      color: $placeholder;
      transition: color 0.2s;

      &:hover,
      &.active {
        color: $blue;
      }

      svg {
        width: 22px;
        height: 22px;
      }
    }
  `,
})
export class PasswordToggle {
  readonly visible = model(false);
}
