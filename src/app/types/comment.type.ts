export interface CommentType {
  id: string;
  text: string;
  date: string;
  likesCount: number;
  dislikesCount: number;
  user: {
    id: string;
    name: string;
  };
}

export interface CommentsResponseType {
  allCount: number;
  comments: CommentType[];
}

export type CommentActionType = 'like' | 'dislike' | 'violate';

export interface CommentUserActionType {
  comment: string;
  action: Exclude<CommentActionType, 'violate'>;
}
