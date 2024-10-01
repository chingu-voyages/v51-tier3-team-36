import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async createGroup(
    createGroupDto: CreateGroupDto,
    userId: Types.ObjectId,
  ): Promise<Group> {
    const inviteCode = nanoid(8);

    const newGroup = new this.groupModel({
      ...createGroupDto,
      createdBy: userId,
      inviteCode,
      participants: [{ userId, contributionWeight: 0 }],
      expenses: [],
    });

    return newGroup.save();
  }

  async getAllGroups(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async getGroupById(groupId: string): Promise<Group> {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException(`Group with id: ${groupId} not found`);
    }
    return group;
  }

  async updateGroup(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(groupId, updateGroupDto, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedGroup) {
      throw new NotFoundException(`Group with id: ${groupId} not found`);
    }
    return updatedGroup;
  }

  async deleteGroup(groupId: string): Promise<void> {
    const result = await this.groupModel.findByIdAndDelete(groupId).exec();
    if (!result) {
      throw new NotFoundException(`Group with id: ${groupId} not found`);
    }
  }
}
