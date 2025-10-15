import { Injectable } from '@nestjs/common';
import { CreateCommentLikeDto } from './dto/create-comment-like.dto';
import { CommentLikeRepository } from './comment-like.repository';
import { UserProfile } from 'src/auth/tokens.interface';

@Injectable()
export class CommentLikeService {
  constructor(private readonly commentLikeRepository: CommentLikeRepository) {}

  create(createCommentLikeDto: CreateCommentLikeDto, user: UserProfile) {
    return this.commentLikeRepository.create(createCommentLikeDto, user);
  }

  remove(comment_id: number, user: UserProfile) {
    return this.commentLikeRepository.remove(comment_id, user);
  }
}
