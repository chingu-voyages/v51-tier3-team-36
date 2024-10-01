import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { RemoveParticipantDto } from './dto/remove-participant.dto';
import { UpdateParticipantWeightDto } from './dto/update-participant-weight.dto';
import { nanoid } from 'nanoid';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    const inviteCode = nanoid(8);

    const newGroup = new this.groupModel({
      ...createGroupDto,
      createdBy: createGroupDto.userId,
      inviteCode,
      participants: [{ userId: createGroupDto.userId, contributionWeight: 0 }],
      expenses: [],
    });

    return newGroup.save();
  }

  async getAllGroups(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async getAllGroupsForUser(userId: string): Promise<Group[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('groups')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }

    return user.groups as unknown as Group[];
  }

  async getGroupById(groupId: string): Promise<Group> {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException(`Group with id: ${groupId} not found`);
    }
    return group;
  }

  async updateGroup(updateGroupDto: UpdateGroupDto): Promise<Group> {
    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(updateGroupDto.groupId, updateGroupDto, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedGroup) {
      throw new NotFoundException(
        `Group with id: ${updateGroupDto.groupId} not found`,
      );
    }
    return updatedGroup;
  }

  async deleteGroup(groupId: string): Promise<{ message: string }> {
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
    const user = await this.userModel.findById(addParticipantDto.userId);
    if (!user) throw new NotFoundException('User not found');

    const group = await this.groupModel.findOne({
      $or: [
        { _id: addParticipantDto.groupIdOrInviteCode },
        { inviteCode: addParticipantDto.groupIdOrInviteCode },
      ],
    });
    if (!group) throw new NotFoundException('Group not found');

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
    const group = await this.groupModel.findById(removeParticipantDto.groupId);
    if (!group) throw new NotFoundException('Group not found');

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
    updateParticipantWeightDto: UpdateParticipantWeightDto,
  ): Promise<Group> {
    const group = await this.groupModel.findById(
      updateParticipantWeightDto.groupId,
    );
    if (!group) throw new NotFoundException('Group not found');

    const participant = group.participants.find((participant) =>
      participant.userId.equals(updateParticipantWeightDto.userId),
    );
    if (!participant)
      throw new NotFoundException('Participant not found in this group');

    participant.contributionWeight =
      updateParticipantWeightDto.contributionWeight;
    await group.save();

    return group;
  }
}
