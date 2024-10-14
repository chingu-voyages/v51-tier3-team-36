import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export interface ICreateExpenseDto {
  name: string;
  description?: string;
  category: string;
  amount: number;
  contributionWeight: number;
  groupId: string;
  receipt?: Express.Multer.File;
}

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Name of the expense',
    example: 'AirBnB',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the expense',
    example: 'Weekend cottage at Lake Takama',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Expense type/category',
    example: 'Housing',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Cost of the expense',
    example: 150,
    type: 'number',
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'The percentage of the expense that the user is contributing',
    example: 50,
    default: 0,
    type: 'number',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  ContributionWeight: number;

  @ApiProperty({
    description: 'Id of the group the expense belongs to',
    example: '66fda1d3b7d6cad62891f0f9',
    type: 'string (id)',
  })
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({
    description: 'Optional receipt proof for the expense as an image file',
    type: 'file',
    required: false,
  })
  @IsOptional()
  receipt?: Express.Multer.File;
}
