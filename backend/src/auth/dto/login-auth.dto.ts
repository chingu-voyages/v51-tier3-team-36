import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {

    @ApiProperty({
        description: 'User email'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: 'User Password'
    })
    @IsNotEmpty()
    @MinLength(8)
    password: string 

}