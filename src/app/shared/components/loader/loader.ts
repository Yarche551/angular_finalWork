import { Component, input } from '@angular/core';

// Лоадер из UI Kit макета
@Component({
  selector: 'app-loader',
  template: `<img class="loader" src="images/loader.png" alt="Загрузка" [style.width.px]="size()" [style.height.px]="size()" />`,
  styles: `
    :host {
      display: flex;
      justify-content: center;
    }

    .loader {
      animation: spin 1s steps(8) infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class Loader {
  readonly size = input(60);
}
