import { ApiProperty } from '@nestjs/swagger';

export class ReportStatsDto {
  @ApiProperty({
    example: 10,
    description: 'Total number of reports uploaded by the user.',
  })
  totalReports: number;

  @ApiProperty({
    example: 5,
    description: 'Number of reports accepted.',
  })
  acceptedReports: number;

  @ApiProperty({
    example: 2,
    description: 'Number of reports rejected.',
  })
  rejectedReports: number;
}
