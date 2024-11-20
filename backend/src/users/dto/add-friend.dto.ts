import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class AddFriendDTO{

    @ApiProperty({
    description: 'The ID of the friend to add',
    example: '60d21b4667d0d8992e610c85',
    })
    @IsString()
    @IsNotEmpty()
    friendId: string;
  }