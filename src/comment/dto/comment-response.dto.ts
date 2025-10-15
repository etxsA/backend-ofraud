import { Comment } from '../entities/comment.entity';

export class CommentResponseDto extends Comment {
  likes: number;
  children?: CommentResponseDto[];
}
