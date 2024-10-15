import {
  ForbiddenException,
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
import validateObjectId from 'src/common/helpers/validateObjectId';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createGroup(
    userId: Types.ObjectId,
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }

    const inviteCode = nanoid(8);

    const newGroup = new this.groupModel({
      createdBy: userId,
      name: createGroupDto.name,
      description: createGroupDto.description || '',
      budget: createGroupDto.budget || 0,
      inviteCode,
      participants: [{ userId: userId, contributionWeight: 0 }],
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

  async getAllGroupsForUser(userId: Types.ObjectId): Promise<Group[]> {
    const user = await this.userModel
      .findById(userId)
      .populate({ path: 'groups', model: 'Group' })
      .exec();
    if (!user) {
      throw new NotFoundException(
        `User with id: ${userId.toString()} not found`,
      );
    }

    return user.groups as unknown as Group[];
  }

  async getGroupById(groupId: string): Promise<Group> {
    validateObjectId(groupId, 'Group');
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException(`Group with id: ${groupId} not found`);
    }
    return group;
  }

  async updateGroup(
    userId: Types.ObjectId,
    updateGroupDto: UpdateGroupDto,
    groupId: string,
  ): Promise<Group> {
    validateObjectId(groupId, 'Group');

    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException(`Group with id: ${groupId} not found`);
    }

    const isParticipant = group.participants.some((participant) =>
      participant.userId.equals(userId),
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not authorized to update this group',
      );
    }

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

  async deleteGroup(
    userId: Types.ObjectId,
    groupId: string,
  ): Promise<{ message: string }> {
    validateObjectId(groupId, 'Group');
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) {
      throw new NotFoundException(`Group with id: ${groupId} not found`);
    }

    const participants = group.participants.map(
      (participant) => participant.userId,
    );
    const isParticipant = participants.some((participantId) =>
      participantId.equals(userId),
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not authorized to delete this group',
      );
    }
    await this.userModel.updateMany(
      { _id: { $in: participants } },
      { $pull: { groups: new Types.ObjectId(groupId) } },
    );

    await this.groupModel.findByIdAndDelete(groupId).exec();

    return {
      message: `Group with id ${groupId} has been successfully deleted`,
    };
  }

  async addParticipant(
    userId: Types.ObjectId,
    addParticipantDto: AddParticipantDto,
  ): Promise<Group> {
    for (const participantId of addParticipantDto.participantIds) {
      validateObjectId(participantId, 'User');
      const user = await this.userModel.findById(participantId);
      if (!user)
        throw new NotFoundException(`User with id: ${participantId} not found`);
    }

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

    const isParticipant = group.participants.some((participant) =>
      participant.userId.equals(userId),
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not authorized to add participants to this group',
      );
    }

    for (const participantId of addParticipantDto.participantIds) {
      const user = await this.userModel.findById(participantId);

      const isAlreadyParticipant = group.participants.some((participant) =>
        participant.userId.equals(participantId),
      );
      if (isAlreadyParticipant) continue;

      group.participants.push({
        userId: new Types.ObjectId(participantId),
        contributionWeight: 0,
      });

      const isGroupInUser = user.groups.some((g) => g.equals(group._id));
      if (!isGroupInUser) {
        user.groups.push(group._id);
        await user.save();
      }
    }

    await group.save();
    return group;
  }

  async removeParticipant(
    userId: Types.ObjectId,
    removeParticipantDto: RemoveParticipantDto,
  ): Promise<Group> {
    validateObjectId(removeParticipantDto.groupId, 'Group');
    for (const participantId of removeParticipantDto.participantIds) {
      validateObjectId(participantId, 'User');
      const user = await this.userModel.findById(participantId);
      if (!user)
        throw new NotFoundException(`User with id: ${participantId} not found`);
    }

    const group = await this.groupModel.findById(removeParticipantDto.groupId);
    if (!group)
      throw new NotFoundException(
        `Group with id: ${removeParticipantDto.groupId} not found`,
      );

    const isParticipant = group.participants.some((participant) =>
      participant.userId.equals(userId),
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not authorized to remove participants from this group',
      );
    }

    for (const participantId of removeParticipantDto.participantIds) {
      group.participants = group.participants.filter(
        (participant) => !participant.userId.equals(participantId),
      );

      await this.userModel.updateOne(
        { _id: participantId },
        {
          $pull: { groups: new Types.ObjectId(removeParticipantDto.groupId) },
        },
      );
    }

    await group.save();
    return group;
  }

  async updateParticipantWeight(
    userId: Types.ObjectId,
    groupId: string,
    updateParticipantWeightDto: UpdateParticipantWeightDto,
  ): Promise<Group> {
    validateObjectId(groupId, 'Group');
    validateObjectId(updateParticipantWeightDto.participantId, 'User');

    const group = await this.groupModel.findById(groupId);
    if (!group)
      throw new NotFoundException(`Group with id: ${groupId} not found`);

    const isParticipant = group.participants.some((participant) =>
      participant.userId.equals(userId),
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not authorized to update contribution weights for this group',
      );
    }

    const participant = group.participants.find((participant) =>
      participant.userId.equals(updateParticipantWeightDto.participantId),
    );
    if (!participant)
      throw new NotFoundException(
        `Participant with id: ${updateParticipantWeightDto.participantId} not found in this group`,
      );

    participant.contributionWeight =
      updateParticipantWeightDto.contributionWeight;
    await group.save();

    return group;
  }
}
