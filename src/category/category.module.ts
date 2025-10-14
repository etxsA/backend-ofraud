import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { DbModule } from 'src/db/db.module';
import { TokensService } from 'src/auth/tokens.service';

@Module({
  imports: [DbModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, TokensService],
})
export class CategoryModule {}
