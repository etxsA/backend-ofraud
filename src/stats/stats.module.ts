import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { StatsRepository } from './stats.repository';
import { DbModule } from 'src/db/db.module';
import { TokensService } from 'src/auth/tokens.service';

@Module({
  imports: [DbModule],
  controllers: [StatsController],
  providers: [StatsService, StatsRepository, TokensService],
})
export class StatsModule {}
