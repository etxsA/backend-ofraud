import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category.',
    example: 'Phishing',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A description of the category.',
    example: 'Reports related to phishing attempts.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The icon of the category, according to SF icons list.',
    example: 'phishing-icon',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;
}
