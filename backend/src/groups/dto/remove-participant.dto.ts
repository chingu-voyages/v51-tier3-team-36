import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export interface IRemoveParticipantDto {
  participantIds: string[];
}

export class RemoveParticipantDto {
  @ApiProperty({
    description: 'User ID of the participant to remove from the group',
    example: ['66f1ae4732de067c7ba5a873', '66f1ae4732de067c7ba5a874'],
    type: 'array of strings',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  participantIds: [string];
}
