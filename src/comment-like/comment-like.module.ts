import { Module } from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import { CommentLikeController } from './comment-like.controller';
import { CommentLikeRepository } from './comment-like.repository';
import { DbModule } from 'src/db/db.module';
import { TokensService } from 'src/auth/tokens.service';

@Module({
  imports: [DbModule],
  controllers: [CommentLikeController],
  providers: [CommentLikeService, CommentLikeRepository, TokensService],
})
export class CommentLikeModule {}
