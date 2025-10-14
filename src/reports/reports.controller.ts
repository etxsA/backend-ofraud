import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/interfaces/authenticated_request';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create report, used to post to the platform' })
  @ApiResponse({
    status: 201,
    description: 'The report has been created.',
    example: {
      title: 'Report Title',
      description: 'Report Description',
      report_pic_url: 'http://example.com/pic.jpg',
      category_id: 2,
      reference_url: 'http://example.com',
      created_at: '2023-10-01',
      updated_at: null,
      deleted_at: null,
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  create(
    @Body() createReportDto: CreateReportDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reportsService.create(createReportDto, req.user.profile);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
