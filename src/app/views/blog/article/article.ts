import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { EMPTY, catchError, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';
import { ArticleCard } from '../../../shared/components/article-card/article-card';
import { Loader } from '../../../shared/components/loader/loader';
import { CommentService } from '../../../shared/services/comment.service';
import { ArticleService } from '../../../shared/services/article.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ArticleDetailType, ArticleType } from '../../../types/article.type';
import {
  CommentActionType,
  CommentType,
  CommentUserActionType,
} from '../../../types/comment.type';
import { Comment } from '../components/comment/comment';

type Reaction = CommentUserActionType['action'];

@Component({
  selector: 'app-article',
  imports: [RouterLink, ReactiveFormsModule, ArticleCard, Loader, Comment],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article {
  private readonly articleService = inject(ArticleService);
  private readonly commentService = inject(CommentService);
  private readonly snackbar = inject(SnackbarService);
  private readonly title = inject(Title);
  protected readonly authService = inject(AuthService);

  // параметр :url из маршрута (withComponentInputBinding)
  readonly url = input.required<string>();

  protected readonly staticPath = environment.serverStaticPath;
  protected readonly article = signal<ArticleDetailType | null>(null);
  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly related = signal<ArticleType[]>([]);

  protected readonly comments = signal<CommentType[]>([]);
  protected readonly commentsCount = signal(0);
  protected readonly commentsLoading = signal(false);
  protected readonly hasMoreComments = computed(
    () => this.comments().length < this.commentsCount(),
  );
  protected readonly userActions = signal<Record<string, Reaction>>({});

  protected readonly commentForm = new FormGroup({
    text: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(1000)],
    }),
  });
  protected readonly commentControl = this.commentForm.controls.text;
  protected readonly sending = signal(false);
  protected readonly returnUrl = computed(() => '/blog/' + this.url());

  constructor() {
    toObservable(this.url)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.notFound.set(false);
        }),
        // ошибку ловим внутри switchMap, чтобы поток не оборвался при переходе на другую статью
        switchMap((url) =>
          this.articleService.getArticle(url).pipe(
            catchError((error: HttpErrorResponse) => {
              this.loading.set(false);
              this.article.set(null);
              this.notFound.set(true);
              if (error.status !== 404) {
                this.snackbar.error('Не удалось загрузить статью');
              }
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((article) => this.onArticleLoaded(article));

    // «Читайте также» — отдельным запросом
    toObservable(this.url)
      .pipe(
        switchMap((url) =>
          this.articleService.getRelatedArticles(url).pipe(catchError(() => of([]))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((articles) => this.related.set(articles));
  }

  private onArticleLoaded(article: ArticleDetailType): void {
    this.article.set(article);
    this.comments.set(article.comments);
    this.commentsCount.set(article.commentsCount);
    this.loading.set(false);
    this.title.setTitle(article.title + ' — АйтиШторм');
    this.loadUserActions(article.id);
  }

  // реакции пользователя для всех комментариев статьи — отдельным запросом
  private loadUserActions(articleId: string): void {
    this.userActions.set({});
    if (!this.authService.isLogged()) {
      return;
    }
    this.commentService.getArticleCommentActions(articleId).subscribe({
      next: (actions) => {
        const map: Record<string, Reaction> = {};
        actions.forEach((item) => (map[item.comment] = item.action));
        this.userActions.set(map);
      },
    });
  }

  loadMoreComments(): void {
    const article = this.article();
    if (!article || this.commentsLoading()) {
      return;
    }
    this.commentsLoading.set(true);
    this.commentService.getComments(article.id, this.comments().length).subscribe({
      next: (response) => {
        const known = new Set(this.comments().map((comment) => comment.id));
        const fresh = response.comments.filter((comment) => !known.has(comment.id));
        this.comments.update((list) => [...list, ...fresh]);
        this.commentsCount.set(response.allCount);
        this.commentsLoading.set(false);
      },
      error: () => {
        this.commentsLoading.set(false);
        this.snackbar.error('Не удалось загрузить комментарии');
      },
    });
  }

  addComment(): void {
    const article = this.article();
    const text = this.commentControl.value.trim();
    if (!article || this.sending()) {
      return;
    }
    if (!text) {
      this.commentControl.setValue('');
      this.commentControl.markAsTouched();
      return;
    }
    if (this.commentControl.invalid) {
      this.commentControl.markAsTouched();
      return;
    }

    this.sending.set(true);
    this.commentService.addComment(article.id, text).subscribe({
      next: () => {
        this.sending.set(false);
        this.commentForm.reset();
        this.snackbar.open('Комментарий опубликован');
        this.refreshComments();
      },
      error: (error: HttpErrorResponse) => {
        this.sending.set(false);
        this.snackbar.error(error.error?.message ?? 'Не удалось отправить комментарий');
      },
    });
  }

  // после отправки заново берём 3 последних комментария и общее количество
  private refreshComments(): void {
    this.articleService.getArticle(this.url()).subscribe({
      next: (article) => {
        this.comments.set(article.comments);
        this.commentsCount.set(article.commentsCount);
      },
    });
  }

  applyAction(comment: CommentType, action: CommentActionType): void {
    if (!this.authService.isLogged()) {
      this.snackbar.open('Чтобы оценивать комментарии, войдите или зарегистрируйтесь');
      return;
    }

    this.commentService.applyAction(comment.id, action).subscribe({
      next: () => {
        if (action === 'violate') {
          this.snackbar.open('Жалоба отправлена');
          return;
        }
        this.updateReaction(comment.id, action);
        this.snackbar.open('Ваш голос учтен');
      },
      error: (error: HttpErrorResponse) => {
        if (action === 'violate' && error.status === 400) {
          this.snackbar.open('Жалоба уже отправлена');
          return;
        }
        this.snackbar.error(error.error?.message ?? 'Не удалось выполнить действие');
      },
    });
  }

  // backend снимает повторную реакцию и переключает лайк <-> дизлайк — повторяем это локально
  private updateReaction(commentId: string, action: Reaction): void {
    const previous = this.userActions()[commentId];
    const next: Reaction | null = previous === action ? null : action;

    this.comments.update((list) =>
      list.map((comment) => {
        if (comment.id !== commentId) {
          return comment;
        }
        const updated = { ...comment };
        if (previous === 'like') updated.likesCount = Math.max(0, updated.likesCount - 1);
        if (previous === 'dislike') updated.dislikesCount = Math.max(0, updated.dislikesCount - 1);
        if (next === 'like') updated.likesCount++;
        if (next === 'dislike') updated.dislikesCount++;
        return updated;
      }),
    );

    this.userActions.update((actions) => {
      const copy = { ...actions };
      if (next) {
        copy[commentId] = next;
      } else {
        delete copy[commentId];
      }
      return copy;
    });
  }

  shareUrl(network: 'vk' | 'facebook'): string {
    const url = encodeURIComponent(location.href);
    const title = encodeURIComponent(this.article()?.title ?? '');
    return network === 'vk'
      ? `https://vk.com/share.php?url=${url}&title=${title}`
      : `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }

  // у Instagram нет веб-ссылки «поделиться», поэтому копируем адрес статьи
  shareInstagram(): void {
    navigator.clipboard
      .writeText(location.href)
      .then(() => this.snackbar.open('Ссылка на статью скопирована — поделитесь ею в Instagram'))
      .catch(() => this.snackbar.error('Не удалось скопировать ссылку'));
  }
}
