import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import {User, UserDocument} from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
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

  // helper function
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID`);
    }
  }

  
  async addFriend(userId: string, friendId: string): Promise<UserDocument | any> {
    this.validateObjectId(userId)
    this.validateObjectId(friendId)

    if (userId == friendId) {
      throw new BadRequestException('Cant add yourself')
    }

    // find user
    const user = await this.userModel.findById(userId).exec()
    if (!user) {
      throw new NotFoundException(`User could not be found`)
    }

    // find friend
    const friend = await this.userModel.findById(friendId).exec()
    if (!friend) {
      throw new NotFoundException(`Friend could not be found`)
    }

    // check if user is already friends
    if (user.friends.includes(friend._id)) {
      throw new ConflictException("User already friends")
    }

    user.friends.push(friend._id)
    const newFriend = friend.friends.push(user._id)

    await user.save() 
    await friend.save()

    return user
  }

  async getFriends(userId: string): Promise< string[]> {
    this.validateObjectId(userId)
    
    const user = await this.userModel.findById(userId).populate('friends', 'name').exec()
    if (!user) {
      throw new NotFoundException('User could not be found')
    }

    return user.friends.map((friend: any) => friend.name)
  }
  
}


