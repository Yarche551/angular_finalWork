import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CommentActionType, CommentType } from '../../../../types/comment.type';

@Component({
  selector: 'app-comment',
  imports: [DatePipe],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
})
export class Comment {
  readonly comment = input.required<CommentType>();
  // реакция текущего пользователя: подсвечивается синим
  readonly userAction = input<'like' | 'dislike' | null>(null);
  readonly action = output<CommentActionType>();
}
