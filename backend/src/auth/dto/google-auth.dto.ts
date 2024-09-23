import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GoogleUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  googleId: string;
}
