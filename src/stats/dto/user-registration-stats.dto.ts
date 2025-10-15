/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class UserRegistrationStatsDto {
  @ApiProperty({
    example: '2024-10-05',
    description: 'The date of registration.',
  })
  date: string;

  @ApiProperty({
    example: 1,
    description: 'The total number of users registered on that date.',
  })
  total_users: number;
}
