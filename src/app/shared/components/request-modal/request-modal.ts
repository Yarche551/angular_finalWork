import { Component, DOCUMENT, computed, effect, inject, signal, untracked } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RequestType } from '../../../types/request.type';
import { RequestModalService } from '../../services/request-modal.service';
import { RequestService } from '../../services/request.service';
import { SERVICES } from '../../utils/services';
import { CustomSelect } from '../custom-select/custom-select';

const PERSON_NAME_PATTERN = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s-]*$/;

@Component({
  selector: 'app-request-modal',
  imports: [ReactiveFormsModule, NgxMaskDirective, CustomSelect],
  providers: [provideNgxMask()],
  templateUrl: './request-modal.html',
  styleUrl: './request-modal.scss',
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class RequestModal {
  private readonly modalService = inject(RequestModalService);
  private readonly requestService = inject(RequestService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly document = inject(DOCUMENT);

  protected readonly state = this.modalService.state;
  protected readonly isOrder = computed(() => this.state()?.type === 'order');
  protected readonly serviceOptions = SERVICES.map((service) => service.title);

  protected readonly sending = signal(false);
  protected readonly success = signal(false);
  protected readonly serverError = signal(false);

  protected readonly form = this.fb.group({
    service: [''],
    name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(PERSON_NAME_PATTERN)]],
    phone: ['', [Validators.required]],
  });

  constructor() {
    // при каждом открытии — чистая форма, услуга подставляется из карточки
    effect(() => {
      const state = this.state();
      this.document.body.style.overflow = state ? 'hidden' : '';
      if (state) {
        untracked(() => this.resetForm(state.type === 'order', state.service));
      }
    });
  }

  private resetForm(isOrder: boolean, service?: string): void {
    this.success.set(false);
    this.serverError.set(false);
    this.sending.set(false);
    this.form.reset({ service: service ?? '', name: '', phone: '' });
    const serviceControl = this.form.controls.service;
    serviceControl.setValidators(isOrder ? Validators.required : null);
    serviceControl.updateValueAndValidity();
  }

  isInvalid(name: 'service' | 'name' | 'phone'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.dirty || control.touched);
  }

  submit(): void {
    const state = this.state();
    if (!state || this.sending()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { service, name, phone } = this.form.getRawValue();
    const request: RequestType = {
      name: name.trim(),
      phone: '+7' + phone,
      type: state.type,
    };
    if (state.type === 'order') {
      request.service = service;
    }

    this.sending.set(true);
    this.serverError.set(false);
    this.requestService.sendRequest(request).subscribe({
      next: (response) => {
        this.sending.set(false);
        if (response.error) {
          this.serverError.set(true);
          return;
        }
        this.success.set(true);
      },
      error: () => {
        this.sending.set(false);
        this.serverError.set(true);
      },
    });
  }

  close(): void {
    if (this.state()) {
      this.modalService.close();
    }
  }
}
