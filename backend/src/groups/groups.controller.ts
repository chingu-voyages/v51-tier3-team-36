import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { GroupService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { RemoveParticipantDto } from './dto/remove-participant.dto';
import { UpdateParticipantWeightDto } from './dto/update-participant-weight.dto';
import { Group } from './schemas/group.schema';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // Create a new group
  @Post()
  async createGroup(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupService.createGroup(createGroupDto);
  }

  // Get all groups
  @Get()
  async getAllGroups(): Promise<Group[]> {
    return this.groupService.getAllGroups();
  }

  // Get all groups for a specific user
  @Get('/user/:userId')
  async getAllGroupsForUser(@Param('userId') userId: string): Promise<Group[]> {
    return this.groupService.getAllGroupsForUser(userId);
  }

  // Get a specific group by ID
  @Get(':groupId')
  async getGroupById(@Param('groupId') groupId: string): Promise<Group> {
    return this.groupService.getGroupById(groupId);
  }

  // Update a group
  @Put(':groupId')
  async updateGroup(
    @Body() updateGroupDto: UpdateGroupDto,
    @Param('groupId') groupId: string,
  ): Promise<Group> {
    return this.groupService.updateGroup(updateGroupDto, groupId);
  }

  // Delete a group
  @Delete(':groupId')
  async deleteGroup(
    @Param('groupId') groupId: string,
  ): Promise<{ message: string }> {
    return this.groupService.deleteGroup(groupId);
  }

  // Add a participant to a group
  @Post('add-participant')
  async addParticipant(
    @Body() addParticipantDto: AddParticipantDto,
  ): Promise<Group> {
    return this.groupService.addParticipant(addParticipantDto);
  }

  // Remove a participant from a group
  @Post('remove-participant')
  async removeParticipant(
    @Body() removeParticipantDto: RemoveParticipantDto,
  ): Promise<Group> {
    return this.groupService.removeParticipant(removeParticipantDto);
  }

  // Update a participant's contribution weight in a group
  @Put('update-weight')
  async updateParticipantWeight(
    @Body() updateParticipantWeightDto: UpdateParticipantWeightDto,
  ): Promise<Group> {
    return this.groupService.updateParticipantWeight(
      updateParticipantWeightDto,
    );
  }
}
