/*eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from './file/file.module';
import { TokensService } from './auth/tokens.service';
import { ReportsModule } from './reports/reports.module';
import { CategoryModule } from './category/category.module';
import { StatusModule } from './status/status.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { CommentLikeModule } from './comment-like/comment-like.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: "neverLeakSecrets",
    }),
    DbModule,
    UserModule,
    AuthModule,
    FileModule,
    ReportsModule,
    CategoryModule,
    StatusModule,
    LikeModule,
    CommentModule,
    CommentLikeModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokensService],
})
export class AppModule {}
