import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import {User, UserDocument} from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: Partial<UserDocument>): Promise<UserDocument> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000 && error.keyValue.email) {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec()
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException(`User with #${id} could not be found`)
    }
    return user;
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const updatedUser = this.userModel
    .findByIdAndUpdate(id, updateUserDto, {new: true}).exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with #${id} could not be found`)
    }
    return updatedUser;
  }

  async remove(id: string): Promise<UserDocument> {
    const deleteUser = await this.userModel.findByIdAndDelete(id).exec()
    if (!deleteUser) {
      throw new NotFoundException((`User with #${id} could not be found`))
    }
    return deleteUser ;
  }

  // select function to include excluded files in schema
  async findByEmail(email: string, passwordIncluded: boolean = false): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ email });
    if (passwordIncluded) {
      query.select('+password');
    }
    return query.exec();
  }


  
  async findByGoogleId(googleId: string, googleIdIncluded: boolean = false): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ googleId });
    if (googleIdIncluded) {
      query.select('+googleId');
    }
    return query.exec();
  }


}


