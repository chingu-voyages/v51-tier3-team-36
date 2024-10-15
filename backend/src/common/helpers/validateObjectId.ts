import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export default function validateObjectId(id: string, entity: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`Invalid ${entity} ID`);
  }
}
