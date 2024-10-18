import { ApiProperty } from '@nestjs/swagger';

export interface IDeleteGroupResponseDto {
  message: string;
}

export class DeleteGroupResponseDto {
  @ApiProperty({
    description: 'Successful group deletion message',
    example:
      'Group with id: 670d5bf0b079986374589d2d has been successfully deleted',
    type: 'string',
  })
  message: string;
}
