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

// Updating user
export class UpdateUserDto {
  @ApiProperty({ example: 1, description: 'ID of the user' })
  id: number;

  @ApiProperty({
    example: 'Jose Torres',
    description: 'Name of the user',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'user@email.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password of the user',
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: 'http://example.com/profile.jpg',
    description: 'URL of the profile picture',
    required: false,
  })
  profile_pic_url?: string;
}

export class UpdateUserResponseDto extends userDto {
  @ApiProperty({ example: 1, description: 'ID of the user' })
  id: number;

  @ApiProperty({
    example: 'http://example.com/profile.jpg',
    description: 'URL of the profile picture',
    required: false,
  })
  profile_pic_url?: string;
}

// Deleting user

export class DeleteUserDto {
  @ApiProperty({ example: 1, description: 'ID of the user' })
  id: number;
}

export class DeleteUserResponseDto extends DeleteUserDto {}
