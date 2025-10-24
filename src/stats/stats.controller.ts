/* eslint-disable prettier/prettier */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TopReportDto } from './dto/top-report.dto';
import { TopUserDto } from './dto/top-user.dto';
import { UserRegistrationStatsDto } from './dto/user-registration-stats.dto';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { ReportsByDayStatsDto } from './dto/reports-by-day-stats.dto';
import { TopReportedPagesDto } from './dto/top-reported-pages.dto';

@ApiTags('Endpoints for statistics')
@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics.',
    type: DashboardStatsDto,
    example: {
      user: 1500,
      reports: 3500,
      comments: 12000,
      likes: 45000,
    },
  })
  getDashboardStats() {
    return this.statsService.getDashboardStats();
  }

  @Get('top-reports')
  @ApiOperation({ summary: 'Get top 10 most liked reports' })
  @ApiResponse({
    status: 200,
    description: 'Top 10 reports with the most likes.',
    type: [TopReportDto],
  })
  findTopLikedReports() {
    return this.statsService.findTopLikedReports();
  }

  @Get('top-users')
  @ApiOperation({ summary: 'Get top 10 users with most reports' })
  @ApiResponse({
    status: 200,
    description: 'Top 10 users with the most reports.',
    type: [TopUserDto],
  })
  findTopReportingUsers() {
    return this.statsService.findTopReportingUsers();
  }

  @Get('user-registrations')
  @ApiOperation({ summary: 'Get user registration stats since a specific date' })
  @ApiQuery({
    name: 'since',
    required: true,
    description: 'The start date (YYYY-MM-DD) to fetch registration stats from.',
    example: '2024-10-05',
  })
  @ApiResponse({
    status: 200,
    description: 'User registration statistics.',
    type: [UserRegistrationStatsDto],
  })
  findUsersRegisteredSince(@Query('since') since: string) {
    return this.statsService.findUsersRegisteredSince(since);
  }

  @Get('reports-by-day')
  @ApiOperation({ summary: 'Get the number of reports per day for the last 7 days' })
  @ApiResponse({
    status: 200,
    description: 'Number of reports per day for the last week.',
    type: [ReportsByDayStatsDto],
    example: [
      { date: '2024-10-08T06:00:00.000Z', count: 15 },
      { date: '2024-10-09T00:00:00.000Z', count: 22 },
      { date: '2024-10-10T00:00:00.000Z', count: 18 },
      { date: '2024-10-11T00:00:00.000Z', count: 25 },
      { date: '2024-10-12T00:00:00.000Z', count: 30 },
      { date: '2024-10-13T00:00:00.000Z', count: 27 },
      { date: '2024-10-14T00:00:00.000Z', count: 20 },
    ],
  })
  findReportsByDayLastWeek() {
    return this.statsService.findReportsByDayLastWeek();
  }

  @Get('reports-by-day-accepted')
  @ApiOperation({ summary: 'Get the number of reports per day for the last 7 days' })
  @ApiResponse({
    status: 200,
    description: 'Number of reports per day for the last week.',
    type: [ReportsByDayStatsDto],
    example: [
      { date: '2024-10-08T06:00:00.000Z', count: 15 },
      { date: '2024-10-09T00:00:00.000Z', count: 22 },
      { date: '2024-10-10T00:00:00.000Z', count: 18 },
      { date: '2024-10-11T00:00:00.000Z', count: 25 },
      { date: '2024-10-12T00:00:00.000Z', count: 30 },
      { date: '2024-10-13T00:00:00.000Z', count: 27 },
      { date: '2024-10-14T00:00:00.000Z', count: 20 },
    ],
  })
  findReportsByDayLastWeekAccepted() {
    return this.statsService.findReportsByDayLastWeekAccepted();
  }

  @Get('top-reported-pages')
  @ApiOperation({ summary: 'Get top 10 most reported pages' })
  @ApiResponse({
    status: 200,
    description: 'Top 10 most reported pages.',
    type: [TopReportedPagesDto],
    example: [
      { reference_url: 'http://example.com/page1', count: 50 },
      { reference_url: 'http://example.com/page2', count: 45 },
      { reference_url: 'http://example.com/page3', count: 40 },
      { reference_url: 'http://example.com/page4', count: 35 },
      { reference_url: 'http://example.com/page5', count: 30 },
      { reference_url: 'http://example.com/page6', count: 25 },
      { reference_url: 'http://example.com/page7', count: 20 },
      { reference_url: 'http://example.com/page8', count: 15 },
      { reference_url: 'http://example.com/page9', count: 10 },
      { reference_url: 'http://example.com/page10', count: 5 },
    ],  
  })
  findTopReportedPages() {
    return this.statsService.findTopReportedPages();
  }

  @Get('reports-by-day-user')
  @ApiOperation({ summary: 'Get the number of reports per day for the last 7 days from a single user' })
  @ApiResponse({
    status: 200,
    description: 'Number of reports per day for the last week.',
    type: [ReportsByDayStatsDto],
    example: [
      { date: '2024-10-08T06:00:00.000Z', count: 15 },
      { date: '2024-10-09T00:00:00.000Z', count: 22 },
      { date: '2024-10-10T00:00:00.000Z', count: 18 },
      { date: '2024-10-11T00:00:00.000Z', count: 25 },
      { date: '2024-10-12T00:00:00.000Z', count: 30 },
      { date: '2024-10-13T00:00:00.000Z', count: 27 },
      { date: '2024-10-14T00:00:00.000Z', count: 20 },
    ],
  })
  findReportsByDayLastWeekUser(@Query('id') id: Number) {
    return this.statsService.findReportsByDayLastWeekUser(id);
  }

  @Get('reports-by-day-user-accepted')
  @ApiOperation({ summary: 'Get the number of reports per day for the last 7 days from a single user' })
  @ApiResponse({
    status: 200,
    description: 'Number of reports per day for the last week.',
    type: [ReportsByDayStatsDto],
    example: [
      { date: '2024-10-08T06:00:00.000Z', count: 15 },
      { date: '2024-10-09T00:00:00.000Z', count: 22 },
      { date: '2024-10-10T00:00:00.000Z', count: 18 },
      { date: '2024-10-11T00:00:00.000Z', count: 25 },
      { date: '2024-10-12T00:00:00.000Z', count: 30 },
      { date: '2024-10-13T00:00:00.000Z', count: 27 },
      { date: '2024-10-14T00:00:00.000Z', count: 20 },
    ],
  })
  findReportsByDayLastWeekUserAccepted(@Query('id') id: Number) {
    return this.statsService.findReportsByDayLastWeekUserAccepted(id);
  }
}