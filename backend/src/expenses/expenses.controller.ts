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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Expense } from './schemas/expenses.schema';

@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @ApiOperation({
    summary: 'Create a new expense',
    description:
      'When creating an expense, user needs to set the name, category, amount, contribution weight, and group id for the expense. The user may also pass in an optional description and receipt file.',
  })
  @Post()
  async createExpense(
    @Req() req,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.createExpense(req.user._id, createExpenseDto);
  }

  @ApiOperation({
    summary: 'Get all expenses',
  })
  @Get()
  async getAllExpenses(): Promise<Expense[]> {
    return this.expensesService.getAllExpenses();
  }

  @ApiOperation({
    summary: 'Get all expenses by user',
    description: 'Returns all expenses for the logged-in user.',
  })
  @Get('/for-user')
  async getAllExpensesForUser(@Req() req): Promise<Expense[]> {
    return this.expensesService.getAllExpensesForUser(req.user._id);
  }

  @ApiOperation({
    summary: 'Get all expenses by group id',
    description: "Returns all expenses for a group via the group's id.",
  })
  @Get('/for-group/:groupId')
  async getAllExpensesForGroup(
    @Param('groupId') groupId: string,
  ): Promise<Expense[]> {
    return this.expensesService.getAllExpensesForGroup(groupId);
  }

  @ApiOperation({
    summary: 'Get an expense via its id',
  })
  @Get(':expenseId')
  async getExpenseById(
    @Param('expenseId') expenseId: string,
  ): Promise<Expense> {
    return this.expensesService.getExpenseById(expenseId);
  }

  @ApiOperation({
    summary: 'Update an expense via its id',
    description:
      'All expense fields are optional. User may not modify the groupId in this operation.',
  })
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

  @ApiOperation({
    summary: 'Delete an expense via its id',
  })
  @Delete(':expenseId')
  async deleteExpense(
    @Req() req,
    @Param('expenseId') expenseId: string,
  ): Promise<{ message: string }> {
    return this.expensesService.deleteExpense(req.user._id, expenseId);
  }
}
