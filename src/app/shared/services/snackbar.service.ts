import { Injectable, signal } from '@angular/core';

export type SnackbarKind = 'info' | 'error';

export interface SnackbarMessage {
  id: number;
  text: string;
  kind: SnackbarKind;
}

// Собственный snackbar: в макете его нет, поэтому показываем аккуратную плашку внизу экрана
@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private nextId = 1;
  readonly messages = signal<SnackbarMessage[]>([]);

  open(text: string, kind: SnackbarKind = 'info', duration = 3000): void {
    const message: SnackbarMessage = { id: this.nextId++, text, kind };
    // одновременно показываем не больше трёх сообщений
    this.messages.update((list) => [...list.slice(-2), message]);
    setTimeout(() => this.close(message.id), duration);
  }

  error(text: string): void {
    this.open(text, 'error', 4000);
  }

  close(id: number): void {
    this.messages.update((list) => list.filter((item) => item.id !== id));
  }
}
