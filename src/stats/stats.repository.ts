import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import { DbService } from 'src/db/db.service';
import { ReportsByDayStatsDto } from './dto/reports-by-day-stats.dto';
import { TopReportedPagesDto } from './dto/top-reported-pages.dto';
import { LikesByDayStatsDto } from './dto/likes-by-date-stats-dto';

interface Count extends RowDataPacket {
  count: number;
}

interface ReportsByDayQueryResult extends RowDataPacket {
  date: string;
  count: number;
}

interface TopReportedPagesQueryResult extends RowDataPacket {
  reference_url: string;
  count: number;
}

interface LikesByDayQueryResult extends RowDataPacket {
  date: string;
  likes_count: number;
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
      WITH RECURSIVE last_7_days AS (
        SELECT CURDATE() - INTERVAL 6 DAY AS date
        UNION ALL
        SELECT date + INTERVAL 1 DAY
        FROM last_7_days
        WHERE date + INTERVAL 1 DAY <= CURDATE()
      )
      SELECT 
        d.date,
        COALESCE(COUNT(r.id), 0) AS count
      FROM last_7_days d
      LEFT JOIN report r
        ON DATE(r.creation_date) = d.date
      GROUP BY d.date
      ORDER BY d.date ASC;
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

  async findReportsByDayLastWeekAccepted(): Promise<ReportsByDayStatsDto[]> {
    const sql = `
      WITH RECURSIVE last_7_days AS (
        SELECT CURDATE() - INTERVAL 6 DAY AS date
        UNION ALL
        SELECT date + INTERVAL 1 DAY
        FROM last_7_days
        WHERE date + INTERVAL 1 DAY <= CURDATE()
      )
      SELECT 
        d.date,
        COALESCE(COUNT(r.id), 0) AS count
      FROM last_7_days d
      LEFT JOIN report r
        ON DATE(r.creation_date) = d.date 
        AND r.status_id=3
      GROUP BY d.date
      ORDER BY d.date ASC;
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

  async findTopReportedPages(): Promise<TopReportedPagesDto[]> {
    const sql = `
      SELECT reference_url, COUNT(id) as count
      FROM report
      WHERE reference_url IS NOT NULL AND reference_url != ''
      GROUP BY reference_url
      ORDER BY count DESC
      LIMIT 10;
    `;
    try {
      const [rows] = await this.dbService
        .getPool()
        .query<TopReportedPagesQueryResult[]>(sql);
      return rows.map((row) => ({
        reference_url: row.reference_url,
        count: Number(row.count),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching top reported pages',
        (error as Error).message,
      );
    }
  }

  async findReportsByDayLastWeekUser(userId: Number): Promise<ReportsByDayStatsDto[]> {
    const sql = `
      WITH RECURSIVE last_7_days AS (
        SELECT CURDATE() - INTERVAL 6 DAY AS date
        UNION ALL
        SELECT date + INTERVAL 1 DAY
        FROM last_7_days
        WHERE date + INTERVAL 1 DAY <= CURDATE()
      )
      SELECT 
        d.date,
        COALESCE(COUNT(r.id), 0) AS count
      FROM last_7_days d
      LEFT JOIN report r
        ON DATE(r.creation_date) = d.date
        AND r.user_id = ?  
      GROUP BY d.date
      ORDER BY d.date ASC;
    `;

    try {
      const [rows] = await this.dbService
        .getPool()
        .query<ReportsByDayQueryResult[]>(sql, [userId]);
      
        return rows.map((row)=>({
          date: row.date, 
          count: Number(row.count),
        }));

    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching user reports by day',
        (error as Error).message,
      );
    }
  }

  async findReportsByDayLastWeekUserAccepted(userId: Number): Promise<ReportsByDayStatsDto[]> {
    const sql = `
      WITH RECURSIVE last_7_days AS (
        SELECT CURDATE() - INTERVAL 6 DAY AS date
        UNION ALL
        SELECT date + INTERVAL 1 DAY
        FROM last_7_days
        WHERE date + INTERVAL 1 DAY <= CURDATE()
      )
      SELECT 
        d.date,
        COALESCE(COUNT(r.id), 0) AS count
      FROM last_7_days d
      LEFT JOIN report r
        ON DATE(r.creation_date) = d.date
        AND r.user_id = ?  
        AND r.status_id = 3
      GROUP BY d.date
      ORDER BY d.date ASC;
    `;

    try {
      const [rows] = await this.dbService
        .getPool()
        .query<ReportsByDayQueryResult[]>(sql, [userId]);
      
        return rows.map((row)=>({
          date: row.date, 
          count: Number(row.count),
        }));

    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching user reports by day',
        (error as Error).message,
      );
    }
  }

  async findLikesByDayLastWeek(userId: Number): Promise<LikesByDayStatsDto[]> {
    const sql = `
      WITH RECURSIVE last_7_days AS (
        SELECT CURDATE() - INTERVAL 6 DAY AS date
        UNION ALL
        SELECT date + INTERVAL 1 DAY
        FROM last_7_days
        WHERE date + INTERVAL 1 DAY <= CURDATE()
      )
      SELECT 
        d.date,
        COUNT(r.id) AS likes_count
      FROM last_7_days d
      LEFT JOIN \`like\` l 
        ON DATE(l.creation_date) = d.date
      LEFT JOIN report r 
        ON l.report_id = r.id AND r.user_id = ?
      GROUP BY d.date
      ORDER BY d.date DESC;
    `;

    try {
      const [rows] = await this.dbService
        .getPool()
        .query<LikesByDayQueryResult[]>(sql, [userId]);
      
        return rows.map((row) => ({
          date: row.date, 
          likes_count: Number(row.likes_count)
        }));

    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching likes by day',
        (error as Error).message,
      );
    }
  }
}
