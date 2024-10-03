import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { Group, GroupDocument } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { RemoveParticipantDto } from './dto/remove-participant.dto';
import { UpdateParticipantWeightDto } from './dto/update-participant-weight.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Helper function to validate ObjectIds
  private validateObjectId(id: string, entity: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${entity} ID`);
    }
  }

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    this.validateObjectId(createGroupDto.userId, 'User');
    const user = await this.userModel.findById(createGroupDto.userId);
    if (!user) {
      throw new NotFoundException(
        `User with id: ${createGroupDto.userId} not found`,
      );
    }

    const inviteCode = nanoid(8);

    const newGroup = new this.groupModel({
      createdBy: createGroupDto.userId,
      name: createGroupDto.name,
      description: createGroupDto.description || '',
      budget: createGroupDto.budget || 0,
      inviteCode,
      participants: [{ userId: createGroupDto.userId, contributionWeight: 0 }],
      expenses: [],
    });

    const savedGroup = await newGroup.save();

    user.groups.push(savedGroup._id);
    await user.save();

    return savedGroup;
  }

  async getAllGroups(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async getAllGroupsForUser(userId: string): Promise<Group[]> {
    this.validateObjectId(userId, 'User');
    const user = await this.userModel
      .findById(userId)
      .populate({ path: 'groups', model: 'Group' })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }

    return user.groups as unknown as Group[];
  }

  async getGroupById(groupId: string): Promise<Group> {
    this.validateObjectId(groupId, 'Group');
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException(`Group with id: ${groupId} not found`);
    }
    return group;
  }

  async updateGroup(
    updateGroupDto: UpdateGroupDto,
    groupId: string,
  ): Promise<Group> {
    this.validateObjectId(groupId, 'Group');
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

  async deleteGroup(groupId: string): Promise<{ message: string }> {
    this.validateObjectId(groupId, 'Group');
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException(`Group with id: ${groupId} not found`);
    }

    const participants = group.participants.map(
      (participant) => participant.userId,
    );
    await this.userModel.updateMany(
      { _id: { $in: participants } },
      { $pull: { groups: new Types.ObjectId(groupId) } },
    );

    await this.groupModel.findByIdAndDelete(groupId).exec();

    return {
      message: `Group with id ${groupId} has been successfully deleted`,
    };
  }

  async addParticipant(addParticipantDto: AddParticipantDto): Promise<Group> {
    this.validateObjectId(addParticipantDto.userId, 'User');
    const user = await this.userModel.findById(addParticipantDto.userId);
    if (!user)
      throw new NotFoundException(
        `User with id: ${addParticipantDto.userId} not found`,
      );

    let group;
    if (Types.ObjectId.isValid(addParticipantDto.groupIdOrInviteCode)) {
      group = await this.groupModel.findById(
        addParticipantDto.groupIdOrInviteCode,
      );
    } else {
      group = await this.groupModel.findOne({
        inviteCode: addParticipantDto.groupIdOrInviteCode,
      });
    }

    if (!group)
      throw new NotFoundException(
        `Group with id/code: ${addParticipantDto.groupIdOrInviteCode} not found`,
      );

    const isAlreadyParticipant = group.participants.some((participant) =>
      participant.userId.equals(addParticipantDto.userId),
    );
    if (isAlreadyParticipant)
      throw new BadRequestException(
        'User is already a participant in this group',
      );

    group.participants.push({
      userId: new Types.ObjectId(addParticipantDto.userId),
      contributionWeight: 0,
    });
    await group.save();

    const isGroupInUser = user.groups.some((g) => g.equals(group._id));
    if (!isGroupInUser) {
      user.groups.push(group._id);
      await user.save();
    }

    return group;
  }

  async removeParticipant(
    removeParticipantDto: RemoveParticipantDto,
  ): Promise<Group> {
    this.validateObjectId(removeParticipantDto.groupId, 'Group');
    this.validateObjectId(removeParticipantDto.userId, 'User');

    const group = await this.groupModel.findById(removeParticipantDto.groupId);
    if (!group)
      throw new NotFoundException(
        `Group with id: ${removeParticipantDto.groupId} not found`,
      );

    group.participants = group.participants.filter(
      (participant) => !participant.userId.equals(removeParticipantDto.userId),
    );
    await group.save();

    await this.userModel.updateOne(
      { _id: removeParticipantDto.userId },
      { $pull: { groups: new Types.ObjectId(removeParticipantDto.groupId) } },
    );

    return group;
  }

  async updateParticipantWeight(
    groupId: string,
    updateParticipantWeightDto: UpdateParticipantWeightDto,
  ): Promise<Group> {
    this.validateObjectId(groupId, 'Group');
    this.validateObjectId(updateParticipantWeightDto.userId, 'User');

    const group = await this.groupModel.findById(groupId);
    if (!group)
      throw new NotFoundException(`Group with id: ${groupId} not found`);

    const participant = group.participants.find((participant) =>
      participant.userId.equals(updateParticipantWeightDto.userId),
    );
    if (!participant)
      throw new NotFoundException(
        `Participant with id: ${updateParticipantWeightDto.userId} not found in this group`,
      );

    participant.contributionWeight =
      updateParticipantWeightDto.contributionWeight;
    await group.save();

    return group;
  }
}
