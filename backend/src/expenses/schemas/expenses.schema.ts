import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export interface IExpense {
  createdBy: string;
  contributionWeight: number;
  name: string;
  decription?: string;
  caregory: string;
  groupId: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema({ timestamps: true })
export class Expense {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ default: 0, min: 0, max: 100 })
  contributionWeight: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  category: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'Group' })
  groupId: Types.ObjectId;

  @Prop()
  receiptUrl?: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

ExpenseSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
