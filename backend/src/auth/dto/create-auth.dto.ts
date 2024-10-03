import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({description: 'User name'})
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({description: 'User email'})
  @IsEmail()
  readonly email: string;

  @ApiProperty({description: 'User password'})
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
  })
  readonly password: string;
}
