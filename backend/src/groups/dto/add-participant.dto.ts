import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddParticipantDto {
  @ApiProperty({
    description: 'User ID of the participant to add to the group',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description:
      'Group ID or invite code of the group to add the participant to',
  })
  @IsString()
  groupIdOrInviteCode: string;
}
