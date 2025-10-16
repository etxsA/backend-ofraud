import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UserProfile } from 'src/auth/tokens.interface';
import { ReportRepository } from './reports.repository';
import { ReportResponseDto } from './dto/report-response.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

@Injectable()
export class ReportsService {
  constructor(private reportRepository: ReportRepository) {}

  create(
    createReportDto: CreateReportDto,
    profile: UserProfile,
  ): Promise<ReportResponseDto> {
    return this.reportRepository.createReport(createReportDto, profile);
  }

  findAll() {
    return this.reportRepository.findAll();
  }

  findPaginated(page: number, limit: number) {
    return this.reportRepository.findPaginated(page, limit);
  }

  findOne(id: number) {
    return this.reportRepository.findById(id);
  }

  update(id: number, updateReportDto: UpdateReportDto, user: UserProfile) {
    return this.reportRepository.updateReport(id, updateReportDto, user);
  }

  acceptReport(id: number, updateReportStatusDto: UpdateReportStatusDto) {
    const status_id = updateReportStatusDto.status_id ?? 3;
    return this.reportRepository.updateReportStatus(id, status_id);
  }

  rejectReport(id: number, updateReportStatusDto: UpdateReportStatusDto) {
    const status_id = updateReportStatusDto.status_id ?? 2;
    return this.reportRepository.updateReportStatus(id, status_id);
  }

  remove(id: number, user: UserProfile) {
    return this.reportRepository.deleteReport(id, user);
  }
}
