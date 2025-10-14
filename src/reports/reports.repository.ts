/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { ReportResponseDto, UpdateReportResponseDto, DeleteReportResponseDto } from "./dto/report-response.dto";
import { ReportModel } from "./entities/report.model";
import { UserProfile } from "src/auth/tokens.interface";
import { UpdateReportDto } from "./dto/update-report.dto";

@Injectable()
export class ReportRepository {
  constructor(private readonly dbService: DbService) {}

  async createReport(createReportDto: CreateReportDto, user: UserProfile): Promise<ReportResponseDto> {
    const { title, description, report_pic_url, category_id, reference_url } = createReportDto;


    const sql = `INSERT INTO report (title, description, report_pic_url, category_id, user_id, reference_url, status_id, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
      const [rows] = await this.dbService.getPool().query(sql, [
        title,
        description,
        report_pic_url,
        category_id,
        user.id,
        reference_url,
        1,
        new Date() // This will insert a JS Date object, which most SQL drivers convert to a proper DATETIME/DATE type
      ]);
      const result = rows as { insertId?: number };
      
      if (!result || !result.insertId) {
        throw new InternalServerErrorException('Report could not be created');
      }

      const newReport: ReportResponseDto = await this.findById(result.insertId);
      return newReport;

    } catch (error) {
      const message = (error as { message?: string }).message;
      throw new InternalServerErrorException(message);
    }
  }

  async findAll(): Promise<ReportModel[]> {
    const sql = `SELECT * FROM report WHERE deleted_at IS NULL`;
    const [rows] = await this.dbService.getPool().query(sql);
    const reports = rows as ReportModel[];
    return reports;
  }

  async findById(id: number): Promise<ReportModel> {
    const sql = `SELECT * FROM report WHERE id = ? AND deleted_at IS NULL LIMIT 1`;
    const [rows] = await this.dbService.getPool().query(sql, [id]);
    const reports = rows as ReportModel[];
    if (reports.length === 0) {
        throw new NotFoundException('Report not found');
    }
    return reports[0];
  }

  async updateReport(id: number, updateReportDto: UpdateReportDto, profile: UserProfile): Promise<UpdateReportResponseDto> {
    const report = await this.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    if (report.user_id !== profile.id && !(profile.admin ?? false)) {
      throw new ForbiddenException('You do not have permission to update this report');
    }
    
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (updateReportDto.title) {
      fields.push(`title = ?`);
      values.push(updateReportDto.title);
    }
    if (updateReportDto.description) {
      fields.push(`description = ?`);
      values.push(updateReportDto.description);
    }
    if (updateReportDto.report_pic_url) {
      fields.push(`report_pic_url = ?`);
      values.push(updateReportDto.report_pic_url);
    }
    if (updateReportDto.category_id) {
        fields.push(`category_id = ?`);
        values.push(updateReportDto.category_id);
    }
    if (updateReportDto.reference_url) {
        fields.push(`reference_url = ?`);
        values.push(updateReportDto.reference_url);
    }
    if (updateReportDto.status_id) {
        fields.push(`status_id = ?`);
        values.push(updateReportDto.status_id);
    }

    if (fields.length === 0) {
      throw new InternalServerErrorException('No fields to update');
    }

    values.push(id);
    const sql = `UPDATE report SET ${fields.join(', ')} WHERE id = ?`;

    try {
      const [result] = await this.dbService.getPool().query(sql, values);
      const updateResult = result as { affectedRows?: number };

      if (updateResult.affectedRows === 0) {
        throw new InternalServerErrorException('Report not found or no changes made');
      }

      const updatedReport = await this.findById(id);
      if (!updatedReport) {
        throw new InternalServerErrorException('Report not found after update');
      }

      return updatedReport;
    } catch (error) {
      const message = (error as { message?: string }).message;
      throw new InternalServerErrorException(message);
    }
  }
  
  async deleteReport(id: number, profile: UserProfile): Promise<DeleteReportResponseDto> {
    const report = await this.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    if (report.user_id !== profile.id && !(profile.admin ?? false)) {
      throw new ForbiddenException('You do not have permission to delete this report');
    }
    
    const sql = `UPDATE report SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`;
    try {
      const [result] = await this.dbService.getPool().query(sql, [id]);
      const deleteResult = result as { affectedRows?: number };
      
      if (deleteResult.affectedRows === 0) {
        throw new InternalServerErrorException('Report not found or could not be deleted');
      }
      return { id };
    } catch (error) {
      const message = (error as { message?: string }).message;
      throw new InternalServerErrorException(message);
    }
  }
}
