import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional, MinLength, Matches } from "class-validator";

export class CreateUserDto {
    @ApiProperty({description: 'User name'})
    @IsString()
    name: string;

    @ApiProperty({description: 'User email'})
    @IsEmail()
    email: string;

    @ApiProperty({description: 'User password'})
    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
    })
    password?: string;

    @ApiProperty({description: 'User googleId'})
    @IsOptional()
    @IsString()
    googleId?: string;

}
