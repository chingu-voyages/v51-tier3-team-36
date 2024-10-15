import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type GroupDocument = HydratedDocument<Group> & {};

export class Participant {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: 0, min: 0, max: 100 })
  contributionWeight: number;
}

@Schema()
export class Group {
  @Prop({ type: Types.ObjectId, ref: 'User' })
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
        _id: false,
        userId: { type: Types.ObjectId, ref: 'User' },
        contributionWeight: Number,
      },
    ],
    default: [],
  })
  participants: Participant[];

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
