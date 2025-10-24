import { ApiProperty } from '@nestjs/swagger';

export class ReportsByDayStatsDto {
  @ApiProperty({
    example: '2025-10-24',
    description: 'The date for which the count is provided.',
  })
  date: string;

  @ApiProperty({
    example: 25,
    description: 'The total number of reports created on that date.',
  })
  count: number;
}
