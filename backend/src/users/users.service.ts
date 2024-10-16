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
  private validateObjectId(id: Types.ObjectId |string): void {
    const idToValidate = id instanceof Types.ObjectId ? id.toString() : id;
    if (!Types.ObjectId.isValid(idToValidate)) {
      throw new BadRequestException(`Invalid ID`);
    }
  }

  
  async addFriend(userId: Types.ObjectId, friendId: string): Promise<UserDocument> {
    this.validateObjectId(userId)
    this.validateObjectId(friendId)

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
      throw new ConflictException("User already friends")
    }

    user.friends.push(friend._id)
    friend.friends.push(user._id)

    await user.save() 
    await friend.save()

    return user
  }

  async getFriends(userId: Types.ObjectId): Promise< UserDocument[]> {
    
    const user = await this.userModel.findById(userId).populate('friends', 'name email').exec()
    if (!user) {
      throw new NotFoundException('User could not be found')
    }

    return user.friends as unknown as UserDocument[]
  }

  async setPassword(userId: Types.ObjectId, setPasswordDto: SetPasswordDto) {
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


