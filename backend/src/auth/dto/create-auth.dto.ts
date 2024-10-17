import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class RegisterDto extends CreateUserDto{

  @ApiProperty({
    description: 'User password',
    minLength: 8,
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
  })
  password: string;
}
