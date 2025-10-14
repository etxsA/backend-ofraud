import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TokensService } from 'src/auth/tokens.service';
import { ReportRepository } from './reports.repository';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, TokensService, ReportRepository],
})
export class ReportsModule {}
