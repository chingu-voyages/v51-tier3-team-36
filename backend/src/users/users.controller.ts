import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from './schemas/user.schema';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard,  } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

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
}
