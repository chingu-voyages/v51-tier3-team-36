import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { RemoveParticipantDto } from './dto/remove-participant.dto';
import { UpdateParticipantWeightDto } from './dto/update-participant-weight.dto';
import { Group } from './schemas/group.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @ApiOperation({
    summary: 'Create a new group',
    description:
      'When creating a group, the user needs to set the name of group, the budget for the group, and an optional decription of the group.',
  })
  @Post()
  async createGroup(
    @Req() req,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return this.groupService.createGroup(req.user._id, createGroupDto);
  }

  @ApiOperation({ summary: 'Get all groups' })
  @Get()
  async getAllGroups(): Promise<Group[]> {
    return this.groupService.getAllGroups();
  }

  @ApiOperation({
    summary: 'Get all groups for a user',
    description:
      'This route retrieves all group documents for the logged-in user.',
  })
  @Get('/by-user')
  async getAllGroupsForUser(@Req() req): Promise<Group[]> {
    return this.groupService.getAllGroupsForUser(req.user._id);
  }

  @ApiOperation({ summary: 'Get a group via its id' })
  @Get(':groupId')
  async getGroupById(@Param('groupId') groupId: string): Promise<Group> {
    return this.groupService.getGroupById(groupId);
  }

  @ApiOperation({
    summary: 'Update a group via its id',
    description:
      "Group's name, decription, or budget can be updated. All fields are optional",
  })
  @Patch(':groupId')
  async updateGroup(
    @Req() req,
    @Body() updateGroupDto: UpdateGroupDto,
    @Param('groupId') groupId: string,
  ): Promise<Group> {
    return this.groupService.updateGroup(req.user._id, updateGroupDto, groupId);
  }

  @ApiOperation({ summary: 'Delete a group via its id' })
  @Delete(':groupId')
  async deleteGroup(
    @Req() req,
    @Param('groupId') groupId: string,
  ): Promise<{ message: string }> {
    return this.groupService.deleteGroup(req.user._id, groupId);
  }

  @ApiOperation({ summary: 'Add participants to a group' })
  @Post('add-participant')
  async addParticipant(
    @Req() req,
    @Body() addParticipantDto: AddParticipantDto,
  ): Promise<Group> {
    return this.groupService.addParticipant(req.user._id, addParticipantDto);
  }

  @ApiOperation({ summary: 'Remove participants from a group' })
  @Post('remove-participant')
  async removeParticipant(
    @Req() req,
    @Body() removeParticipantDto: RemoveParticipantDto,
  ): Promise<Group> {
    return this.groupService.removeParticipant(
      req.user._id,
      removeParticipantDto,
    );
  }

  @ApiOperation({ summary: "Update a participant's contribution weight" })
  @Patch('update-weight/:groupId')
  async updateParticipantWeight(
    @Req() req,
    @Param('groupId') groupId: string,
    @Body() updateParticipantWeightDto: UpdateParticipantWeightDto,
  ): Promise<Group> {
    return this.groupService.updateParticipantWeight(
      req.user._id,
      groupId,
      updateParticipantWeightDto,
    );
  }
}
