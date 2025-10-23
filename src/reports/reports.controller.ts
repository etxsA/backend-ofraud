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
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/interfaces/authenticated_request';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { ReportStatsDto } from './dto/report-stats.dto';

@ApiTags('Endpoints for report management')
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
      id: 1,
      title: 'Report Title',
      description: 'Report Description',
      report_pic_url: 'http://example.com/pic.jpg',
      category_id: 2,
      user_id: 1,
      reference_url: 'http://example.com',
      creation_date: '2025-10-14T00:00:00.000Z',
      status_id: 1,
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({
    status: 200,
    description: 'Return all reports.',
    example: [
      {
        id: 1,
        title: 'Report Title',
        description: 'Report Description',
        report_pic_url: 'http://example.com/pic.jpg',
        category_id: 2,
        user_id: 1,
        reference_url: 'http://example.com',
        creation_date: '2025-10-14T00:00:00.000Z',
        status_id: 1,
        deleted_at: null,
      },
    ],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('paginated')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reports with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated reports.',
    example: [
      {
        id: 1,
        title: 'Report Title',
        description: 'Report Description',
        report_pic_url: 'http://example.com/pic.jpg',
        category_id: 2,
        user_id: 1,
        reference_url: 'http://example.com',
        creation_date: '2025-10-14T00:00:00.000Z',
        status_id: 1,
        deleted_at: null,
      },
    ],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findPaginated(@Query('page') page: string, @Query('limit') limit: string) {
    return this.reportsService.findPaginated(+page, +limit);
  }

  @Get('status/:statusId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reports by status' })
  @ApiResponse({
    status: 200,
    description: 'Return reports by status.',
    example: [
      {
        id: 1,
        title: 'Report Title',
        description: 'Report Description',
        report_pic_url: 'http://example.com/pic.jpg',
        category_id: 2,
        user_id: 1,
        reference_url: 'http://example.com',
        creation_date: '2025-10-14T00:00:00.000Z',
        status_id: 1,
        deleted_at: null,
      },
    ],
  })
  @ApiResponse({
    status: 404,
    description: 'No reports found with this status.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findByStatus(@Param('statusId') statusId: string) {
    return this.reportsService.findByStatus(+statusId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reports by user id' })
  @ApiResponse({
    status: 200,
    description: 'Return reports by user id.',
    example: [
      {
        id: 1,
        title: 'Report Title',
        description: 'Report Description',
        report_pic_url: 'http://example.com/pic.jpg',
        category_id: 2,
        user_id: 1,
        reference_url: 'http://example.com',
        creation_date: '2025-10-14T00:00:00.000Z',
        status_id: 1,
        deleted_at: null,
      },
    ],
  })
  @ApiResponse({
    status: 404,
    description: 'No reports found for this user.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findByUserId(@Param('userId') userId: string) {
    return this.reportsService.findByUserId(+userId);
  }

  @Get('stats/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get report statistics for a user' })
  @ApiResponse({
    status: 200,
    description: 'Return report statistics for a user.',
    type: ReportStatsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getReportStatsByUserId(@Param('userId') userId: string) {
    return this.reportsService.getReportStatsByUserId(+userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get report by id' })
  @ApiResponse({
    status: 200,
    description: 'Return report by id.',
    example: {
      id: 1,
      title: 'Report Title',
      description: 'Report Description',
      report_pic_url: 'http://example.com/pic.jpg',
      category_id: 2,
      user_id: 1,
      reference_url: 'http://example.com',
      creation_date: '2025-10-14T00:00:00.000Z',
      status_id: 1,
      deleted_at: null,
    },
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update report by id only by admin' })
  @ApiResponse({
    status: 200,
    description: 'The report has been updated.',
    example: {
      id: 1,
      title: 'Updated Report Title',
      description: 'Updated Report Description',
      report_pic_url: 'http://example.com/pic.jpg',
      category_id: 2,
      user_id: 1,
      reference_url: 'http://example.com',
      creation_date: '2025-10-14T00:00:00.000Z',
      status_id: 2,
      deleted_at: null,
    },
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reportsService.update(+id, updateReportDto, req.user.profile);
  }

  @Patch(':id/accept')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a report (Admin only)' })
  @ApiResponse({ status: 200, description: 'The report has been accepted.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  acceptReport(
    @Param('id') id: string,
    @Body() updateReportStatusDto: UpdateReportStatusDto,
  ) {
    return this.reportsService.acceptReport(+id, updateReportStatusDto);
  }

  @Patch(':id/reject')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a report (Admin only)' })
  @ApiResponse({ status: 200, description: 'The report has been rejected.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  rejectReport(
    @Param('id') id: string,
    @Body() updateReportStatusDto: UpdateReportStatusDto,
  ) {
    return this.reportsService.rejectReport(+id, updateReportStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete report by id' })
  @ApiResponse({
    status: 200,
    description: 'The report has been deleted.',
    example: { id: 1 },
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.reportsService.remove(+id, req.user.profile);
  }
}
