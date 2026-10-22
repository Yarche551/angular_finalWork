import { CommentType } from './comment.type';

export interface ArticleType {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  url: string;
}

export interface ArticleDetailType extends ArticleType {
  text: string;
  comments: CommentType[];
  commentsCount: number;
}

export interface ArticlesResponseType {
  count: number;
  pages: number;
  items: ArticleType[];
}
