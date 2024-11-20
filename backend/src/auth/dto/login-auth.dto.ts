import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {

    @ApiProperty({
        description: 'User email address',
        example: 'johndoe@example.com',
      })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: 'User password',
        minLength: 8,
        example: 'Password123!',
      })
    @IsNotEmpty()
    @MinLength(8)
    password: string 

}