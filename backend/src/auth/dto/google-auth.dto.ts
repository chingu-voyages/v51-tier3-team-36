import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class GoogleUserDto extends CreateUserDto {

  @ApiProperty({
    description: 'User Google ID',
    example: '106562378642658987654',
  })
  @IsString()
  @IsNotEmpty()
  googleId: string;
}
