import { IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  // REGEX - Passwords must contain at least:
  // 1 upper case letter
  // 1 lower case letter
  // 1 number or special character
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'invalid password'
  })
  password: string;
}