import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { StatusRepository } from './status.repository';
import { DbModule } from 'src/db/db.module';
import { TokensService } from 'src/auth/tokens.service';

@Module({
  imports: [DbModule],
  controllers: [StatusController],
  providers: [StatusService, StatusRepository, TokensService],
})
export class StatusModule {}
