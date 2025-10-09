export class userDto {
  readonly name: string;
  readonly email: string;
}

export class CreateUserDto extends userDto {
  readonly password: string;
}
