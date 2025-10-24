import { ApiProperty } from '@nestjs/swagger';

export class TopReportedPagesDto {
  @ApiProperty({
    example: 'http://example.com/scam-page',
    description: 'The URL of the reported page.',
  })
  reference_url: string;

  @ApiProperty({
    example: 42,
    description: 'The number of times this page has been reported.',
  })
  count: number;
}
