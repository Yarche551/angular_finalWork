import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponseType } from '../../types/default-response.type';
import {
  CommentActionType,
  CommentUserActionType,
  CommentsResponseType,
} from '../../types/comment.type';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly http = inject(HttpClient);

  getComments(articleId: string, offset: number): Observable<CommentsResponseType> {
    return this.http.get<CommentsResponseType>(environment.api + 'comments', {
      params: { article: articleId, offset },
    });
  }

  addComment(articleId: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text,
      article: articleId,
    });
  }

  applyAction(commentId: string, action: CommentActionType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(
      environment.api + 'comments/' + commentId + '/apply-action',
      { action },
    );
  }

  getCommentActions(commentId: string): Observable<CommentUserActionType[]> {
    return this.http.get<CommentUserActionType[]>(
      environment.api + 'comments/' + commentId + '/actions',
    );
  }

  getArticleCommentActions(articleId: string): Observable<CommentUserActionType[]> {
    return this.http.get<CommentUserActionType[]>(
      environment.api + 'comments/article-comment-actions',
      { params: { articleId } },
    );
  }
}
