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

// This is used to return the user with its ID after creation
export class UserResponseDto extends userDto {
  @ApiProperty({ example: 1, description: 'ID of the user' })
  id: number;
}
