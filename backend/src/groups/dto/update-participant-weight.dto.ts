import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateParticipantWeightDto {
  @ApiProperty({
    description: 'User ID of the participant being updated',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Group ID of the group the participant belongs to',
  })
  @IsString()
  groupId: string;

  @ApiProperty({
    description:
      'New contribution weight for the participant as a percentage. 0 means equal contribution',
  })
  @IsNumber()
  contributionWeight: number;
}
