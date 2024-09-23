import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User, UserDocument} from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
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

  async findByEmail(email: string): Promise<UserDocument> | null {
    return this.userModel.findOne({email}).exec()
  }

  async findByGoogleId(googleId: string): Promise<UserDocument> | null {
    return this.userModel.findOne({googleId}).exec()
  }

  async createUserGoogle(googleUser: Partial<UserDocument>): Promise<UserDocument> {
    try {
      const createUser = new this.userModel({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId
      })

      return await createUser.save()
    } catch (error) {
      if (error.code === 11000 && error.keyValue.email) {

        throw new ConflictException('Email already in use')
      }
      throw error;
    }
    
    
  }

}


