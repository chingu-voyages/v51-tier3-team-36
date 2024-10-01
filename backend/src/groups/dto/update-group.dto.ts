import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({
    description: 'Group ID of the group being updated',
  })
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({
    description: 'Name of the group',
    example: 'Weekend Trip',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description of the group',
    example: 'A weekend getaway with friends',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Initial budget for the group',
    example: 100.0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;
}
