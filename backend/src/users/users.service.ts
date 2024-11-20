import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose'
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import {User, UserDocument} from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { SetPasswordDto } from 'src/auth/dto/set-password.dto';
import * as bcrypt from 'bcrypt';

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
    const query = this.userModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
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
  private validateObjectId(id: Types.ObjectId | string, context: string): void {
    const idToValidate = id instanceof Types.ObjectId ? id.toString() : id;
    if (!Types.ObjectId.isValid(idToValidate)) {
      throw new BadRequestException(`Invalid ${context} ID: ${idToValidate}`);
    }
  }

  
  async addFriend(userId: string, friendId: string): Promise<UserDocument> {
    this.validateObjectId(userId, 'User')
    this.validateObjectId(friendId, "Friend")

    if (userId.toString() == friendId) {
      throw new BadRequestException('Cant add yourself')
    }

    // find user
    const user = await this.userModel.findById(userId).exec()
    // find friend
    const friend = await this.userModel.findById(friendId).exec()


    if (!user) {
      throw new NotFoundException(`User could not be found`)
    }

    
    if (!friend) {
      throw new NotFoundException(`Friend could not be found`)
    }

    // check if user is already friends
    if (user.friends.includes(friend._id)) {
      throw new ConflictException("This person is already friend")
    }

    user.friends.push(friend._id)
    friend.friends.push(user._id)

    await user.save() 
    await friend.save()

    return this.userModel.findById(friend._id).select('name email').exec();
  }

  async getFriends(userId: string): Promise< UserDocument[]> {
    this.validateObjectId(userId, 'User')
    
    const user = await this.userModel.findById(userId).populate('friends', 'name email').exec()
    if (!user) {
      throw new NotFoundException('User could not be found')
    }

    return user.friends as unknown as UserDocument[]
  }


  async removeFriend(userId: string, friendId: string): Promise<UserDocument> {
    this.validateObjectId(userId, 'User')
    this.validateObjectId(friendId, "Friend")


    if (userId.toString() == friendId) {
      throw new BadRequestException('Cant delete yourself from friends list')
    }
    const friend = await this.userModel.findById(friendId).exec()
    const user = await this.userModel.findById(userId).exec()

    if (!friend) {
      throw new NotFoundException((`User with #${friendId} could not be found`))
    }

    if (!user) {
      throw new NotFoundException((`User with #${userId} could not be found`))
    }
    const friendIndex = user.friends.indexOf(friend._id);
    if (friendIndex === -1) {
    throw new ConflictException('This person is not your friend');
  }

    user.friends.splice(friendIndex, 1);
    await user.save();

    const userIndex = friend.friends.indexOf(user._id);
    if (userIndex !== -1) {
     friend.friends.splice(userIndex, 1);
     await friend.save();
  }

    return this.userModel.findById(friend._id).select('name email').exec();

   
    }

  async setPassword(userId: string, setPasswordDto: SetPasswordDto) {
    const user = await this.userModel.findById(userId).exec()
    if (!user) {
      throw new NotFoundException('User could not be found')
    }

    if (user.password) {
      throw new BadRequestException('Password is already set.');
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(setPasswordDto.password, salt);
    await user.save();

    return user;
  }


  
}


