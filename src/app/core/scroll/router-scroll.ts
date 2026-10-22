import { ViewportScroller } from '@angular/common';
import { DOCUMENT, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs';

const RETRY_MS = 50;
const MAX_ATTEMPTS = 40;

// Страницы подгружаются лениво, и в момент события Scroll нужного блока может ещё не быть
// в DOM. Поэтому немного ждём, пока якорь появится (или страница вырастет до сохранённой
// позиции при навигации «назад»), и только потом прокручиваем.
export function setupRouterScroll(): void {
  const router = inject(Router);
  const viewportScroller = inject(ViewportScroller);
  const document = inject(DOCUMENT);
  viewportScroller.setHistoryScrollRestoration('manual');

  const whenReady = (isReady: () => boolean, action: () => void, attempt = 0): void => {
    if (isReady() || attempt >= MAX_ATTEMPTS) {
      action();
      return;
    }
    setTimeout(() => whenReady(isReady, action, attempt + 1), RETRY_MS);
  };

  router.events
    .pipe(
      filter((event): event is Scroll => event instanceof Scroll),
      takeUntilDestroyed(),
    )
    .subscribe(({ anchor, position }) => {
      if (anchor) {
        whenReady(
          () => !!document.getElementById(anchor),
          () => viewportScroller.scrollToAnchor(anchor),
        );
      } else if (position) {
        const [, y] = position;
        whenReady(
          () => document.documentElement.scrollHeight >= y + window.innerHeight,
          () => viewportScroller.scrollToPosition(position, { behavior: 'instant' }),
        );
      } else {
        viewportScroller.scrollToPosition([0, 0], { behavior: 'instant' });
      }
    });
}
