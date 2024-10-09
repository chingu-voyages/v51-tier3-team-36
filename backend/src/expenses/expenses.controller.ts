import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Expense } from './schemas/expenses.schema';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async createExpense(
    @Req() req,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.createExpense(req.user._id, createExpenseDto);
  }

  @Get()
  async getAllExpenses(): Promise<Expense[]> {
    return this.expensesService.getAllExpenses();
  }

  @Get('/for-user')
  async getAllExpensesForUser(@Req() req): Promise<Expense[]> {
    return this.expensesService.getAllExpensesForUser(req.user._id);
  }

  @Get(':expenseId')
  async getExpenseById(
    @Param('expenseId') expenseId: string,
  ): Promise<Expense> {
    return this.expensesService.getExpenseById(expenseId);
  }

  @Patch(':expenseId')
  async updateExpense(
    @Req() req,
    @Param('expenseId') expenseId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.updateExpense(
      req.user._id,
      expenseId,
      updateExpenseDto,
    );
  }

  @Delete(':expenseId')
  async deleteExpense(
    @Req() req,
    @Param('expenseId') expenseId: string,
  ): Promise<{ message: string }> {
    return this.expensesService.deleteExpense(req.user._id, expenseId);
  }
}
