import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  amount: number;

  @Prop({required: true})
  date: Date;

  // association
  @Prop({})
  creator: Types.ObjectId;

  @Prop()
  group: Types.ObjectId;

  @Prop({default: []})
  expenses: Types.ObjectId[];
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);