import { ApiProperty } from '@nestjs/swagger';

export interface IDeleteExpenseResponseDto {
  message: string;
}

export class DeleteExpenseResponseDto {
  @ApiProperty({
    description: 'Successful expense deletion message',
    example:
      'Expense with id: 670d5bf0b079986374589d2d has been successfully deleted',
    type: 'string',
  })
  message: string;
}
