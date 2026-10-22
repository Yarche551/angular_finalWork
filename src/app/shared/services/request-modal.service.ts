import { Injectable, signal } from '@angular/core';
import { RequestKind } from '../../types/request.type';

export interface RequestModalState {
  type: RequestKind;
  service?: string;
}

// Модалка заявки живёт в layout, поэтому её можно открыть с любой страницы
@Injectable({ providedIn: 'root' })
export class RequestModalService {
  readonly state = signal<RequestModalState | null>(null);

  openOrder(service?: string): void {
    this.state.set({ type: 'order', service });
  }

  openConsultation(): void {
    this.state.set({ type: 'consultation' });
  }

  close(): void {
    this.state.set(null);
  }
}
