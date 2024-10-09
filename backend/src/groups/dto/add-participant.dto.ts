import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AddParticipantDto {
  @ApiProperty({
    description: 'User ID of the participant to add to the group',
    example: ['66f1ae4732de067c7ba5a873', '66f1ae4732de067c7ba5a874'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  participantIds: string[];

  @ApiProperty({
    description:
      'Group ID or invite code of the group to add the participant to',
    example: '66fda222a96c66f268211f92',
  })
  @IsString()
  groupIdOrInviteCode: string;
}
