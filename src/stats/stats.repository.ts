import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class StatsRepository {
  constructor(private readonly dbService: DbService) {}

  async findTopLikedReports(): Promise<any[]> {
    const sql = `
      SELECT r.id, r.title, COUNT(l.report_id) AS likes
      FROM report r
      LEFT JOIN \`like\` l ON r.id = l.report_id
      GROUP BY r.id, r.title
      ORDER BY likes DESC
      LIMIT 10;
    `;
    try {
      const [rows] = await this.dbService.getPool().query(sql);
      return rows as any[];
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findTopReportingUsers(): Promise<any[]> {
    const sql = `
      SELECT u.id, u.name, COUNT(r.user_id) AS num_reports
      FROM user u
      LEFT JOIN report r ON u.id = r.user_id
      GROUP BY u.id, u.name
      ORDER BY num_reports DESC
      LIMIT 10;
    `;
    try {
      const [rows] = await this.dbService.getPool().query(sql);
      return rows as any[];
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findUsersRegisteredSince(since: string): Promise<any[]> {
    const sql = `
      SELECT DATE(creation_date) AS date, COUNT(id) AS total_users
      FROM user
      WHERE creation_date >= ?
      GROUP BY DATE(creation_date)
      ORDER BY date ASC;
    `;
    try {
      const [rows] = await this.dbService.getPool().query(sql, [since]);
      return rows as any[];
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
