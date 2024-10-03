import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddParticipantDto {
  @ApiProperty({
    description: 'User ID of the participant to add to the group',
    example: '66fda1d3b7d6cad62891f0f9',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description:
      'Group ID or invite code of the group to add the participant to',
    example: '66fda222a96c66f268211f92',
  })
  @IsString()
  groupIdOrInviteCode: string;
}
