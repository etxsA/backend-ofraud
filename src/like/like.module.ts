import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeRepository } from './like.repository';
import { DbModule } from 'src/db/db.module';
import { TokensService } from 'src/auth/tokens.service';

@Module({
  imports: [DbModule],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository, TokensService],
})
export class LikeModule {}
