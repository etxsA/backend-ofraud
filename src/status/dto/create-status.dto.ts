import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({
    description: 'The name of the status.',
    example: 'In Progress',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
