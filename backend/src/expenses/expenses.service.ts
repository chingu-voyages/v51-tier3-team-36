import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument } from './schemas/expenses.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: Model<ExpenseDocument>,
  ) {}

  async createExpense(
    userId: Types.ObjectId,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return 'This action adds a new expense';
  }

  async getAllExpenses(): Promise<Expense[]> {
    return `This action returns all expenses`;
  }

  async getAllExpensesForUser(userId: Types.ObjectId): Promise<Expense[]> {
    return `This action returns all expenses for a user`;
  }

  async getExpenseById(expenseId: string): Promise<Expense> {
    return `This action returns a #${expenseId} expense`;
  }

  async updateExpense(
    userId: Types.ObjectId,
    expenseId: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return `This action updates a #${expenseId} expense`;
  }

  async deleteExpense(
    userId: Types.ObjectId,
    expenseId: string,
  ): Promise<{ message: string }> {
    return `This action removes a #${expenseId} expense`;
  }
}
