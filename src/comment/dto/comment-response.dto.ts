import { Comment } from '../entities/comment.entity';

export class CommentUserDto {
  id: number;
  name: string;
  email: string;
  profilePic?: string;
}

export class CommentResponseDto extends Comment {
  likes: number;
  user: CommentUserDto;
  children?: CommentResponseDto[];
}
