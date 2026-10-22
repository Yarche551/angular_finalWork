import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ArticleType } from '../../../types/article.type';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
})
export class ArticleCard {
  readonly article = input.required<ArticleType>();
  protected readonly staticPath = environment.serverStaticPath;
}
