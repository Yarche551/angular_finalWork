import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleCard } from '../../shared/components/article-card/article-card';
import { Loader } from '../../shared/components/loader/loader';
import { ArticleService } from '../../shared/services/article.service';
import { RequestModalService } from '../../shared/services/request-modal.service';
import { CONTACTS } from '../../shared/utils/menu';
import { SERVICES } from '../../shared/utils/services';
import { ArticleType } from '../../types/article.type';
import { ADVANTAGES, BANNERS, REVIEWS } from './main.data';

const BANNER_AUTOPLAY_MS = 7000;

@Component({
  selector: 'app-main',
  imports: [RouterLink, DecimalPipe, ArticleCard, Loader],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  host: {
    '(window:resize)': 'onResize()',
  },
})
export class Main {
  private readonly articleService = inject(ArticleService);
  private readonly requestModal = inject(RequestModalService);

  protected readonly banners = BANNERS;
  protected readonly services = SERVICES;
  protected readonly advantages = ADVANTAGES;
  protected readonly reviews = REVIEWS;
  protected readonly contacts = CONTACTS;

  protected readonly topArticles = signal<ArticleType[]>([]);
  protected readonly articlesLoading = signal(true);

  // Слайдер акций: один слайд, по кругу, с автопрокруткой
  protected readonly bannerIndex = signal(0);
  private bannerPaused = false;

  // Слайдер отзывов: 3 / 2 / 1 карточки в зависимости от ширины экрана
  protected readonly reviewsPerView = signal(this.calcReviewsPerView());
  protected readonly reviewIndex = signal(0);
  protected readonly maxReviewIndex = computed(() =>
    Math.max(0, this.reviews.length - this.reviewsPerView()),
  );

  constructor() {
    this.articleService.getTopArticles().subscribe({
      next: (articles) => {
        this.topArticles.set(articles);
        this.articlesLoading.set(false);
      },
      error: () => this.articlesLoading.set(false),
    });

    const timer = setInterval(() => {
      if (!this.bannerPaused) {
        this.nextBanner();
      }
    }, BANNER_AUTOPLAY_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  prevBanner(): void {
    this.bannerIndex.update((i) => (i - 1 + this.banners.length) % this.banners.length);
  }

  nextBanner(): void {
    this.bannerIndex.update((i) => (i + 1) % this.banners.length);
  }

  pauseBanner(paused: boolean): void {
    this.bannerPaused = paused;
  }

  prevReview(): void {
    this.reviewIndex.update((i) => (i <= 0 ? this.maxReviewIndex() : i - 1));
  }

  nextReview(): void {
    this.reviewIndex.update((i) => (i >= this.maxReviewIndex() ? 0 : i + 1));
  }

  orderService(service?: string): void {
    this.requestModal.openOrder(service);
  }

  onResize(): void {
    this.reviewsPerView.set(this.calcReviewsPerView());
    this.reviewIndex.update((i) => Math.min(i, this.maxReviewIndex()));
  }

  private calcReviewsPerView(): number {
    const width = window.innerWidth;
    if (width < 768) {
      return 1;
    }
    return width < 1100 ? 2 : 3;
  }
}
