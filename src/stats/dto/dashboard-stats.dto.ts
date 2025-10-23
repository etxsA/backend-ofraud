import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ example: 150, description: 'Total number of users' })
  users: number;

  @ApiProperty({ example: 500, description: 'Total number of reports' })
  reports: number;

  @ApiProperty({ example: 2500, description: 'Total number of likes' })
  likes: number;

  @ApiProperty({ example: 1200, description: 'Total number of comments' })
  comments: number;
}
