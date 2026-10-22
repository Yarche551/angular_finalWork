import { Directive, ElementRef, inject, output } from '@angular/core';

// Закрытие выпадающих меню по клику вне элемента
@Directive({
  selector: '[appClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class ClickOutsideDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly appClickOutside = output<void>();

  onDocumentClick(event: MouseEvent): void {
    // composedPath, а не contains: элемент под курсором мог уже исчезнуть из DOM после перерисовки
    if (!event.composedPath().includes(this.elementRef.nativeElement)) {
      this.appClickOutside.emit();
    }
  }
}
