/* eslint-disble prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@email.com', description: 'Email of the user' })
  email: string;
  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password of the user',
  })
  password: string;
}

export class tokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token',
  })
  token: string;
}
