import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateExpenseDto {
  @ApiProperty({
    description: 'Name of the expense',
    example: 'AirBnB',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

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
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Cost of the expense',
    example: 150,
    type: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @ApiProperty({
    description: 'The percentage of the expense that the user is contributing',
    example: 50,
    default: 0,
    type: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  ContributionWeight?: number;

  @ApiProperty({
    description: 'Optional receipt proof for the expense as an image file',
    type: 'file',
    required: false,
  })
  @IsOptional()
  receipt?: File;
}
