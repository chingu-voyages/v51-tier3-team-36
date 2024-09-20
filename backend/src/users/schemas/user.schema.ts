import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required: true})
  name: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop()
  password?: string;

  @Prop()
  googleId?: string;

  // association
  @Prop({default: []})
  friends: Types.ObjectId[];

  @Prop({default: []})
  groups: Types.ObjectId[];

  @Prop({default: []})
  expenses: Types.ObjectId[];

  @Prop({default: []})
  receipts: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);