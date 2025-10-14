import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UserProfile } from 'src/auth/tokens.interface';
import { ReportRepository } from './reports.repository';
import { ReportResponseDto } from './dto/report-response.dto';

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
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
