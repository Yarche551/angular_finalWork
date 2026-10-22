import { Component, inject } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  template: `
    <div class="snackbars" aria-live="polite">
      @for (message of snackbar.messages(); track message.id) {
        <div class="snackbar" [class.error]="message.kind === 'error'" role="status">
          <span class="snackbar-text">{{ message.text }}</span>
          <button
            type="button"
            class="snackbar-close"
            aria-label="Закрыть уведомление"
            (click)="snackbar.close(message.id)"
          >
            <span class="icon-close"></span>
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './snackbar.scss',
})
export class Snackbar {
  protected readonly snackbar = inject(SnackbarService);
}
