/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class TopReportDto {
  @ApiProperty({ example: 1, description: 'The ID of the report.' })
  id: number;

  @ApiProperty({
    example: 'Estafa por mensajes SMS bancarios',
    description: 'The title of the report.',
  })
  title: string;

  @ApiProperty({ example: 127, description: 'The number of likes for the report.' })
  likes: number;
}
