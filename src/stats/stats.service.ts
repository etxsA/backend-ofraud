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

  findReportsByDayLastWeekAccepted() {
    return this.statsRepository.findReportsByDayLastWeekAccepted();
  }

  findTopReportedPages() {
    return this.statsRepository.findTopReportedPages();
  }

  findReportsByDayLastWeekUser(user_id: Number) {
    return this.statsRepository.findReportsByDayLastWeekUser(user_id);
  }

  findReportsByDayLastWeekUserAccepted(user_id: Number) {
    return this.statsRepository.findReportsByDayLastWeekUserAccepted(user_id);
  }

  findLikesByDayLastWeek(userId: Number) {
    return this.statsRepository.findLikesByDayLastWeek(userId);
  }
}