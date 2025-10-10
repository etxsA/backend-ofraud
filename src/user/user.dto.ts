export class userDto {
  name: string;
  email: string;
}

export class CreateUserDto extends userDto {
  password: string;
}
