import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActiveParamsType } from '../../types/active-params.type';
import {
  ArticleDetailType,
  ArticleType,
  ArticlesResponseType,
} from '../../types/article.type';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly http = inject(HttpClient);

  getTopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getArticles(params: ActiveParamsType): Observable<ArticlesResponseType> {
    let httpParams = new HttpParams().set('page', params.page);
    params.categories.forEach((url) => (httpParams = httpParams.append('categories[]', url)));
    return this.http.get<ArticlesResponseType>(environment.api + 'articles', {
      params: httpParams,
    });
  }

  getArticle(url: string): Observable<ArticleDetailType> {
    return this.http.get<ArticleDetailType>(environment.api + 'articles/' + encodeURIComponent(url));
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(
      environment.api + 'articles/related/' + encodeURIComponent(url),
    );
  }
}
