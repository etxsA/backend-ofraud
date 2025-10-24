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

  async getDashboardStats() {
    const [users, reports, likes, comments] = await Promise.all([
      this.statsRepository.countUsers(),
      this.statsRepository.countReports(),
      this.statsRepository.countLikes(),
      this.statsRepository.countComments(),
    ]);
    return { users, reports, likes, comments };
  }

  findReportsByDayLastWeek() {
    return this.statsRepository.findReportsByDayLastWeek();
  }

  findTopReportedPages() {
    return this.statsRepository.findTopReportedPages();
  }
}