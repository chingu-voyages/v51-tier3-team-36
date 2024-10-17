import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { AddFriendDTO } from './add-friend.dto';

export class RemoveFriendDTO extends(AddFriendDTO) {
  @ApiProperty({ description: 'ID of the friend to be removed' })
  @IsString()
  @IsNotEmpty()
  friendId: string;
}
