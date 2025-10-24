import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import { DbService } from 'src/db/db.service';
import { ReportsByDayStatsDto } from './dto/reports-by-day-stats.dto';

interface Count extends RowDataPacket {
  count: number;
}

interface ReportsByDayQueryResult extends RowDataPacket {
  date: string;
  count: number;
}

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

  async countUsers(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM user WHERE deleted_at IS NULL';
    try {
      const [rows] = await this.dbService.getPool().query<Count[]>(sql);
      return rows[0].count;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error counting users',
        (error as Error).message,
      );
    }
  }

  async countReports(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM report';
    try {
      const [rows] = await this.dbService.getPool().query<Count[]>(sql);
      return rows[0].count;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error counting reports',
        (error as Error).message,
      );
    }
  }

  async countLikes(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM `like`';
    try {
      const [rows] = await this.dbService.getPool().query<Count[]>(sql);
      return rows[0].count;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error counting likes',
        (error as Error).message,
      );
    }
  }

  async countComments(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM comment';
    try {
      const [rows] = await this.dbService.getPool().query<Count[]>(sql);
      return rows[0].count;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error counting comments',
        (error as Error).message,
      );
    }
  }

  async findReportsByDayLastWeek(): Promise<ReportsByDayStatsDto[]> {
    const sql = `
      SELECT DATE(creation_date) as date, COUNT(id) as count
      FROM report
      WHERE creation_date >= CURDATE() - INTERVAL 7 DAY
      GROUP BY DATE(creation_date)
      ORDER BY date ASC;
    `;
    try {
      const [rows] = await this.dbService
        .getPool()
        .query<ReportsByDayQueryResult[]>(sql);
      return rows.map((row) => ({
        date: row.date,
        count: Number(row.count),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching reports by day',
        (error as Error).message,
      );
    }
  }
}
