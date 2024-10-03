import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class UpdateParticipantWeightDto {
  @ApiProperty({
    description: 'User ID of the participant being updated',
    example: '66fda1d3b7d6cad62891f0f9',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description:
      'New contribution weight for the participant as a percentage. 0 means equal contribution',
    example: '0',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  contributionWeight: number;
}
