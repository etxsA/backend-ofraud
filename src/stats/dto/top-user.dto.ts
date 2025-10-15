/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class TopUserDto {
  @ApiProperty({ example: 1, description: 'The ID of the user.' })
  id: number;

  @ApiProperty({ example: 'Ana García', description: 'The name of the user.' })
  name: string;

  @ApiProperty({
    example: 10,
    description: 'The number of reports created by the user.',
  })
  num_reports: number;
}
