import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt'

export type UserDocument = HydratedDocument<User>;

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


UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.password && this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();

})