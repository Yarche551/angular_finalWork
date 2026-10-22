import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  template: `
    <a class="logo" routerLink="/" aria-label="АйтиШторм — на главную">
      <img class="logo-icon" src="images/icons/logo-icon.svg" alt="" width="24" height="24" />
      <span class="logo-text">АйтиШторм</span>
    </a>
  `,
  styles: `
    @use 'variables' as *;

    .logo {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      width: 85px;
    }

    .logo-text {
      font-family: $font-logo;
      font-size: 16px;
      line-height: 23px;
      color: $blue;
      white-space: nowrap;
    }
  `,
})
export class Logo {}
