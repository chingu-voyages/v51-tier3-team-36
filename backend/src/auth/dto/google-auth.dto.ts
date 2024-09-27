import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleUserDto {
  @ApiProperty({
    description: 'Google name',
  })
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Google email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Google ID',
  })
  @IsString()
  @IsNotEmpty()
  googleId: string;
}
