import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional } from "class-validator";

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
    password?: string;

    @ApiProperty({description: 'User googleId'})
    @IsOptional()
    @IsString()
    googleId?: string;

}
