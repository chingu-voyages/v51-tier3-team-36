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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Expense } from './schemas/expenses.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { DeleteExpenseResponseDto } from './dto/delete-exponse-response.dto';

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
  @ApiCreatedResponse({
    description: 'Successfully created expense',
    type: ExpenseResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('receipt'))
  async createExpense(
    @Req() req,
    @Body() createExpenseDto: CreateExpenseDto,
    @UploadedFile() receipt: Express.Multer.File,
  ): Promise<Expense> {
    if (receipt) {
      createExpenseDto.receipt = receipt;
    }
    return this.expensesService.createExpense(req.user._id, createExpenseDto);
  }

  @ApiOperation({
    summary: 'Get all expenses',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved expenses',
    type: ExpenseResponseDto,
    isArray: true,
  })
  @Get()
  async getAllExpenses(): Promise<Expense[]> {
    return this.expensesService.getAllExpenses();
  }

  @ApiOperation({
    summary: 'Get all expenses by user',
    description: 'Returns all expenses for the logged-in user.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved expenses',
    type: ExpenseResponseDto,
    isArray: true,
  })
  @Get('/for-user')
  async getAllExpensesForUser(@Req() req): Promise<Expense[]> {
    return this.expensesService.getAllExpensesForUser(req.user._id);
  }

  @ApiOperation({
    summary: 'Get all expenses by group id',
    description: "Returns all expenses for a group via the group's id.",
  })
  @ApiOkResponse({
    description: 'Successfully retrieved expenses',
    type: ExpenseResponseDto,
    isArray: true,
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
  @ApiOkResponse({
    description: 'Successfully retrieved expense',
    type: ExpenseResponseDto,
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
  @ApiOkResponse({
    description: 'Successfully updated expense',
    type: ExpenseResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @Patch(':expenseId')
  @UseInterceptors(FileInterceptor('receipt'))
  async updateExpense(
    @Req() req,
    @Param('expenseId') expenseId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @UploadedFile() receipt: Express.Multer.File,
  ) {
    if (receipt) {
      updateExpenseDto.receipt = receipt;
    }
    return this.expensesService.updateExpense(
      req.user._id,
      expenseId,
      updateExpenseDto,
    );
  }

  @ApiOperation({
    summary: 'Delete an expense via its id',
  })
  @ApiOkResponse({
    description: 'Successfully deleted expense',
    type: DeleteExpenseResponseDto,
  })
  @Delete(':expenseId')
  async deleteExpense(
    @Req() req,
    @Param('expenseId') expenseId: string,
  ): Promise<{ message: string }> {
    return this.expensesService.deleteExpense(req.user._id, expenseId);
  }
}
