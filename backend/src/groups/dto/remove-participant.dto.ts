import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class RemoveParticipantDto {
  @ApiProperty({
    description: 'User ID of the participant to remove from the group',
    example: ['66f1ae4732de067c7ba5a873', '66f1ae4732de067c7ba5a874'],
    type: 'array of strings',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  participantIds: string[];

  @ApiProperty({
    description: 'Group ID of the group to remove the participant from',
    example: '66fda222a96c66f268211f92',
    type: 'string (id)',
  })
  @IsString()
  groupId: string;
}
