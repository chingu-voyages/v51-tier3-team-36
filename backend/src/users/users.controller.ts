import { Controller, Get, Post, Body, Patch, Param, Delete, Put, BadRequestException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from './schemas/user.schema';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard,  } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AddFriendDTO } from './dto/add-friend.dto';
import { GetUser } from './decorators/get-user.decorator';


@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @ApiOperation({summary: 'Get all Users'})
  @Get()
  async findAll(): Promise<User[]>  {
    return this.usersService.findAll();
  }

  @ApiOperation({summary: 'Get a user by id'})
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }


  @ApiOperation({summary: 'Update a user info'})
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateOne(id, updateUserDto);
  }


  @ApiOperation({summary: 'Delete a user'})
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('add-friend')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a friend' })
  async addFriend(@GetUser() user: any , @Body() addFriendDTO: AddFriendDTO) {
    const userId = user.sub;
    const {friendId} = addFriendDTO
    return this.usersService.addFriend(userId, friendId);
  }


  @ApiOperation({summary: "Get all friends"})
  @Get(':id/friends/names')
  async getFriends(@Param('id') id: string): Promise<string[]> {
    return this.usersService.getFriends(id);
  }
}
