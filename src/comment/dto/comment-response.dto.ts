import { Comment } from '../entities/comment.entity';

export class CommentUserDto {
  id: number;
  name: string;
  email: string;
  profile_pic_url?: string;
}

export class CommentResponseDto extends Comment {
  likes: number;
  user: CommentUserDto;
  children?: CommentResponseDto[];
}
