import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveParticipantDto {
  @ApiProperty({
    description: 'User ID of the participant to remove from the group',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Group ID of the group to remove the participant from',
  })
  @IsString()
  groupId: string;
}
