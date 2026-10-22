import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ArticleCard } from '../../../shared/components/article-card/article-card';
import { Loader } from '../../../shared/components/loader/loader';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { ArticleService } from '../../../shared/services/article.service';
import { CategoryService } from '../../../shared/services/category.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { parseActiveParams, toQueryParams } from '../../../shared/utils/active-params';
import { ActiveParamsType } from '../../../types/active-params.type';
import { ArticleType } from '../../../types/article.type';
import { CategoryType } from '../../../types/category.type';

@Component({
  selector: 'app-blog',
  imports: [ArticleCard, Loader, Pagination, ClickOutsideDirective],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
  host: {
    '(document:keydown.escape)': 'filterOpen.set(false)',
  },
})
export class Blog {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly articleService = inject(ArticleService);
  private readonly categoryService = inject(CategoryService);
  private readonly snackbar = inject(SnackbarService);

  protected readonly categories = signal<CategoryType[]>([]);
  protected readonly articles = signal<ArticleType[]>([]);
  protected readonly pages = signal(0);
  protected readonly loading = signal(true);
  protected readonly filterOpen = signal(false);

  // фильтр и страница берутся из URL, поэтому переживают перезагрузку страницы
  private readonly params$ = this.route.queryParamMap.pipe(map(parseActiveParams));
  protected readonly params = toSignal(this.params$, {
    initialValue: parseActiveParams(this.route.snapshot.queryParamMap),
  });
  protected readonly activeCategories = computed(() =>
    this.categories().filter((category) => this.params().categories.includes(category.url)),
  );

  constructor() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.snackbar.error('Не удалось загрузить категории'),
    });

    this.params$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap((params) =>
          this.articleService.getArticles(params).pipe(
            catchError(() => {
              this.snackbar.error('Не удалось загрузить статьи');
              return of({ count: 0, pages: 0, items: [] });
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.loading.set(false);
        this.articles.set(response.items);
        this.pages.set(response.pages);
        // страница из URL больше, чем есть на самом деле — переходим на последнюю
        if (response.pages > 0 && this.params().page > response.pages) {
          this.navigate({ ...this.params(), page: response.pages }, true);
        }
      });
  }

  isActive(url: string): boolean {
    return this.params().categories.includes(url);
  }

  toggleCategory(url: string): void {
    const current = this.params().categories;
    const categories = current.includes(url)
      ? current.filter((item) => item !== url)
      : [...current, url];
    this.navigate({ page: 1, categories });
  }

  removeCategory(url: string): void {
    this.navigate({ page: 1, categories: this.params().categories.filter((item) => item !== url) });
  }

  openPage(page: number): void {
    this.navigate({ ...this.params(), page });
  }

  private navigate(params: ActiveParamsType, replaceUrl = false): void {
    this.router.navigate(['/blog'], { queryParams: toQueryParams(params), replaceUrl });
  }
}
