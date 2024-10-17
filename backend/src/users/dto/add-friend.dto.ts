import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsNotEmpty } from 'class-validator';


export class AddFriendDTO{

    @IsString()
    @IsNotEmpty()
    friendId: string;
  }