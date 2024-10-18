import { ApiProperty } from '@nestjs/swagger';

export interface IExpenseResponseDto {
  createdBy: string;
  contributionWeight: number;
  name: string;
  description?: string;
  category: string;
  amount: number;
  groupId: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export class ExpenseResponseDto {
  @ApiProperty({
    description: 'Id of the user who created the expense',
    example: '6704141ac79df25cb20d2800',
    type: 'string (id)',
  })
  createdBy: string;

  @ApiProperty({
    description: 'The percentage of the expense that the user is contributing',
    example: 50,
    type: 'number',
  })
  ContributionWeight: number;

  @ApiProperty({
    description: 'Name of the expense',
    example: 'AirBnB',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the expense',
    example: 'Weekend cottage at Lake Takama',
    type: 'string',
  })
  description?: string;

  @ApiProperty({
    description: 'Expense type/category',
    example: 'Housing',
    type: 'string',
  })
  category: string;

  @ApiProperty({
    description: 'Cost of the expense',
    example: 150,
    type: 'number',
  })
  amount: number;

  @ApiProperty({
    description: 'Id of the group the expense belongs to',
    example: '66fda1d3b7d6cad62891f0f9',
    type: 'string (id)',
  })
  groupId: string;

  @ApiProperty({
    description: 'Image url of the receipt of the expense',
    example:
      'https://res.cloudinary.com/di4hsrmz4/image/upload/v1728925151/ceena82k5cm8vvrg2mhf.jpg',
    type: 'string',
  })
  receiptUrl?: string;

  @ApiProperty({
    description:
      'Date and time when the expense was created as an ISO 8601 date string',
    example: '2024-10-14T12:34:56.789Z',
    type: 'date string',
  })
  createdAt: string;

  @ApiProperty({
    description:
      'Date and time when the expense was updated as an ISO 8601 date string',
    example: '2024-10-14T12:34:57.789Z',
    type: 'date string',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Id of the expense',
    example: '670d4ddd3c03640c00e6965b',
    type: 'string (id)',
  })
  id: string;
}
