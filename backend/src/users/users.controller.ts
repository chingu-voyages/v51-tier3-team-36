import { Controller, Get, Post, Body, Patch, Param, Delete, Put, BadRequestException, Req, } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {User, UserDocument} from './schemas/user.schema';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard,  } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AddFriendDTO } from './dto/add-friend.dto';
import { GetUser } from './decorators/get-user.decorator';
import { SetPasswordDto } from 'src/auth/dto/set-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RemoveFriendDTO } from './dto/remove-friend.dto';


@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @ApiOperation({summary: 'Get all Users'})
  @ApiResponse({ status: 200, description: 'List of users', type: [CreateUserDto] })
  @Get()
  async findAll(): Promise<User[]>  {
    return this.usersService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Authenticated user', type: CreateUserDto })
  @ApiOperation({summary: 'Get authenticated user'})
  @Get('me')
  async findOne(@GetUser() user): Promise<User> {
    return this.usersService.findOne(user._id);
  }

  @ApiResponse({ status: 200, description: 'Updated user', type: CreateUserDto })
  @ApiOperation({summary: 'Update a user info'})
  @Patch('update/me')
  async update(@GetUser() user, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateOne(user._id, updateUserDto);
  }


  @ApiOperation({summary: 'Delete a user'})
  @Delete('me')
  async remove(@GetUser() user) {
    return this.usersService.remove(user._id);
  }

  @ApiResponse({ status: 200, description: 'Friend added', type: CreateUserDto })
  @Post('friends')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a friend' })
  async addFriend(@GetUser() user: any , @Body() addFriendDTO: AddFriendDTO) {
    return this.usersService.addFriend(user._id, addFriendDTO.friendId);
  }

  @ApiResponse({ status: 200, description: 'List of friends', type: [CreateUserDto] })
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "Get all user friends"})
  @Get('/friends')
  async getFriends(@GetUser() user): Promise<UserDocument[]> {
    return this.usersService.getFriends(user._id);
  }

  @ApiOperation({summary: 'Delete a friend'})
  @Delete('friends')
  async removeFriend(@GetUser() user, @Body() removeFriendDTO: RemoveFriendDTO) {
    const removedFriend = await this.usersService.removeFriend(user._id, removeFriendDTO.friendId);
    return {
      message: 'Friend removed successfully',
      friend: removedFriend,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set-password')
  @ApiOperation({ summary: 'Set password for a user' })
  @ApiResponse({ status: 200, description: 'Password set successfully' })
  @ApiBody({ type: SetPasswordDto })
  async setPassword(
    @GetUser() user,
    @Body() setPasswordDto: SetPasswordDto,
  ) {
    return this.usersService.setPassword(user._id, setPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/set-password')
  @ApiOperation({ summary: 'Set password for a user' })
  @ApiBody({ type: SetPasswordDto })
  async setPassword(
    @GetUser() user,
    @Body() setPasswordDto: SetPasswordDto,
  ) {
    return this.usersService.setPassword(user._id, setPasswordDto);
  }
}
