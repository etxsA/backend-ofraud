import { ApiProperty } from '@nestjs/swagger';

export class userDto {
  @ApiProperty({ example: 'Jose Torres', description: 'Name of the user' })
  name: string;
  @ApiProperty({ example: 'user@email.com', description: 'Email of the user' })
  email: string;
}

export class CreateUserDto extends userDto {
  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password of the user',
  })
  password: string;
}
