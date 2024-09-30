import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type GroupDocument = HydratedDocument<Group> & {};

@Schema()
export class Group {
  @Prop()
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  inviteCode: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: 0 })
  budget: number;

  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        contributionWeight: { type: Number, default: 0 }, // default 0 for equal contribution
      },
    ],
    default: [],
  })
  participants: { userId: Types.ObjectId; contributionWeight: number }[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Expense' }], default: [] })
  expenses: Types.ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);

GroupSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
