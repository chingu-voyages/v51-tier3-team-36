import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export interface IUpdateGroupDto {
  name?: string;
  description?: string;
  budget?: number;
}

export class UpdateGroupDto {
  @ApiProperty({
    description: 'Name of the group',
    example: 'Weekend Trip',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description of the group',
    example: 'A weekend getaway with friends',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Initial budget for the group',
    example: 100.0,
    type: 'number',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;
}
