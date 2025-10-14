import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: 'The title of the report.',
    example: 'Web Fraud Banking Portal',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'A detailed description of the issue being reported.',
    example: 'The website pretends to hijack user credentials',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description:
      'A URI pointing to a picture of the report issue, this should only be populated with files uploaded to the api',
    example: '/images/streetlight.jpg',
  })
  @IsString()
  @IsNotEmpty()
  report_pic_url: string;

  @ApiProperty({
    description: 'The ID of the category this report belongs to. (Optional)',
    example: 3,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({
    description: 'A reference URL for the incident',
    example: 'https://bbva.fraude.com',
  })
  @IsUrl()
  @IsNotEmpty()
  reference_url: string;

  @ApiProperty({
    description:
      'The initial status ID for the report (e.g., 1 for "Submitted").',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  status_id: number;
}
