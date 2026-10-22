import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RequestModal } from '../components/request-modal/request-modal';
import { Snackbar } from '../components/snackbar/snackbar';
import { Footer } from './footer/footer';
import { Header } from './header/header';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Footer, RequestModal, Snackbar],
  template: `
    <app-header />
    <main class="main">
      <router-outlet />
    </main>
    <app-footer />
    <app-request-modal />
    <app-snackbar />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main {
      flex: 1;
    }
  `,
})
export class Layout {}
