/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { StatsRepository } from './stats.repository';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  findTopLikedReports() {
    return this.statsRepository.findTopLikedReports();
  }

  findTopReportingUsers() {
    return this.statsRepository.findTopReportingUsers();
  }

  findUsersRegisteredSince(since: string) {
    return this.statsRepository.findUsersRegisteredSince(since);
  }
}