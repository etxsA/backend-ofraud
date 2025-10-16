/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateReportStatusDto {
  @ApiPropertyOptional({
    description: 'The new status ID for the report. Defaults to 3 for accept and 2 for reject.',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  status_id?: number;
}
