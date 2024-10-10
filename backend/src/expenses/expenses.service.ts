import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument } from './schemas/expenses.schema';
import { InjectModel } from '@nestjs/mongoose';
import validateObjectId from 'src/common/helpers/validateObjectId';
import { Group, GroupDocument } from 'src/groups/schemas/group.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: Model<ExpenseDocument>,
    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createExpense(
    userId: Types.ObjectId,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }

    validateObjectId(createExpenseDto.groupId, 'Group');
    const group = await this.groupModel
      .findById(createExpenseDto.groupId)
      .exec();
    if (!group) {
      throw new NotFoundException(
        `Group with id: ${createExpenseDto.groupId} not found`,
      );
    }

    const isParticipant = group.participants.some((participant) =>
      participant.userId.equals(userId),
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not allowed to create expenses for this group',
      );
    }

    // let receiptUrl = '';
    if (createExpenseDto.receipt) {
      // Cloudinary image upload logic
    }

    const newExpense = new this.expenseModel({
      createdBy: userId,
      name: createExpenseDto.name,
      description: createExpenseDto.description || '',
      category: createExpenseDto.category,
      amount: createExpenseDto.amount,
      contributionWeight: createExpenseDto.ContributionWeight || 0,
      groupId: createExpenseDto.groupId,
      // receiptUrl,
    });

    const savedExpense = await newExpense.save();

    user.expenses.push(savedExpense._id);
    await user.save();

    group.expenses.push(savedExpense._id);
    await group.save();

    return savedExpense;
  }

  async getAllExpenses(): Promise<Expense[]> {
    return this.expenseModel.find().exec();
  }

  async getAllExpensesForUser(userId: Types.ObjectId): Promise<Expense[]> {
    const user = await this.userModel
      .findById(userId)
      .populate({ path: 'expenses', model: 'Expense' })
      .exec();
    if (!user) {
      throw new NotFoundException(
        `User with id: ${userId.toString()} not found`,
      );
    }

    return user.expenses as unknown as Expense[];
  }

  async getExpenseById(expenseId: string): Promise<Expense> {
    validateObjectId(expenseId, 'Expense');
    const expense = await this.expenseModel.findById(expenseId).exec();
    if (!expense) {
      throw new NotFoundException(`Expense with id: ${expenseId} not found`);
    }

    return expense;
  }

  async updateExpense(
    userId: Types.ObjectId,
    expenseId: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const { receipt, ...updateFields } = updateExpenseDto;
    validateObjectId(expenseId, 'Expense');

    const expense = await this.expenseModel.findById(expenseId).exec();
    if (!expense) {
      throw new NotFoundException(`Expense with id: ${expenseId} not found`);
    }

    const isOwner = expense.createdBy.equals(userId);
    if (!isOwner) {
      throw new ForbiddenException(
        'You are not authorized to update this expense',
      );
    }

    // let receiptUrl = '';
    if (receipt) {
      // Cloudinary upload image logic
    }

    const updatedExpense = await this.expenseModel
      .findByIdAndUpdate(expenseId, updateFields, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedExpense) {
      throw new NotFoundException(`Expense with id: ${expenseId} not found`);
    }

    // if (receiptUrl) {
    //   updatedExpense.receiptUrl = receiptUrl;
    //   await updatedExpense.save();
    // }

    return updatedExpense;
  }

  async deleteExpense(
    userId: Types.ObjectId,
    expenseId: string,
  ): Promise<{ message: string }> {
    validateObjectId(expenseId, 'Expense');
    const expense = await this.expenseModel.findById(expenseId).exec();
    if (!expense) {
      throw new NotFoundException(`Expense with id: ${expenseId} not found`);
    }

    const isOwner = expense.createdBy.equals(userId);
    if (!isOwner) {
      throw new ForbiddenException(
        'You are not authorized to delete this expense',
      );
    }

    await this.groupModel.updateOne(
      { _id: expense.groupId },
      { $pull: { expenses: new Types.ObjectId(expenseId) } },
    );

    await this.userModel.updateOne(
      { _id: userId },
      { $pull: { expenses: new Types.ObjectId(expenseId) } },
    );

    await this.expenseModel.findByIdAndDelete(expenseId).exec();

    return {
      message: `Expense with id: ${expenseId} has been successfully deleted`,
    };
  }
}
