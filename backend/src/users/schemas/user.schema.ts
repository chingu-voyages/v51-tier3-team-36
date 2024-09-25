import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt'

export type UserDocument = HydratedDocument<User> & {
  
};

@Schema()
export class User {
  @Prop({required: true})
  name: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop({select: false}) //
  password?: string;

  @Prop({select: false})
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
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();

  

})

// exclude sensitive fields from responses at database level
UserSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    ret.id = ret._id.toString(); 
    delete ret._id;
    delete ret.password;
    delete ret.googleId;
    delete ret.__v;
    return ret;
  }, })