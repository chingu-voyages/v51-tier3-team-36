import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    description: 'User ID of the user that created the group',
    example: '66fda1d3b7d6cad62891f0f9',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Name of the group',
    example: 'Weekend Trip',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
  })
  @IsNumber()
  @Min(0)
  budget: number;
}
