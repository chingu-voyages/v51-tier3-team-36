import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class GoogleUserDto extends CreateUserDto {

  @ApiProperty({
    description: 'User Google ID',
  })
  @IsString()
  @IsNotEmpty()
  googleId: string;
}
