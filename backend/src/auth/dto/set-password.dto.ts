import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class SetPasswordDto {

    
  @ApiProperty({description: 'User password'})
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
  })
  password: string;
}
