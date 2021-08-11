import { IsString, Matches, MinLength } from "class-validator";

export class SigninUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}