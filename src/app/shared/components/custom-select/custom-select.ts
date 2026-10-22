import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

// Кастомный выпадающий список, работает как обычный formControl
@Component({
  selector: 'app-custom-select',
  imports: [ClickOutsideDirective],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustomSelect), multi: true },
  ],
})
export class CustomSelect implements ControlValueAccessor {
  readonly options = input.required<string[]>();
  readonly placeholder = input('Выберите услугу');
  readonly invalid = input(false);

  protected readonly value = signal('');
  protected readonly open = signal(false);
  protected readonly disabled = signal(false);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  toggle(): void {
    if (!this.disabled()) {
      this.open.update((open) => !open);
    }
  }

  select(option: string): void {
    this.value.set(option);
    this.onChange(option);
    this.close();
  }

  // Esc закрывает сначала список, и только потом — модалку вокруг
  onEscape(event: Event): void {
    if (this.open()) {
      event.stopPropagation();
      this.close();
    }
  }

  close(): void {
    if (this.open()) {
      this.open.set(false);
      this.onTouched();
    }
  }
}
