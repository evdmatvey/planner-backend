import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FinancesTransactionType } from '@prisma/__generated__';
import { Auth, UseUser } from '@/auth';
import {
  ApiRouteDocs,
  BadRequestResponse,
  MessageResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  badRequestResponseDescription,
  notFoundResponseDescription,
  unauthorizedResponseDescription,
} from '@/shared/swagger';
import { PagedRequest } from '@/shared/types/paged-request.type';
import { CreateFinanceTransactionDto } from './dto/create-finances-transaction.dto';
import { UpdateFinanceTransactionDto } from './dto/update-finance-transaction.dto';
import { FinancesTransactionService } from './finances-transaction.service';
import { transactionResponseMessageBuilder } from './lib/transaction-response-message-builder';
import {
  CreateTransactionOkResponse,
  FinancesTransactionResponse,
  PagedFinancesTransactionResponse,
  UpdateTransactionOkResponse,
} from './swagger';

@Auth()
@ApiBearerAuth()
@ApiTags('Транзакции')
@UsePipes(new ValidationPipe())
@Controller('finances/transactions')
export class FinancesTransactionController {
  public constructor(
    private readonly _financesTransactionService: FinancesTransactionService,
    private readonly _logger: Logger,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiRouteDocs({
    summary: 'Создание транзакции',
    apiResponses: {
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
      ok: {
        type: CreateTransactionOkResponse,
        description: 'Транзакция создана успешно',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async create(
    @UseUser('id') userId: string,
    @Body() dto: CreateFinanceTransactionDto,
  ) {
    try {
      this._logger.log(`Creating transaction for user ${userId}`);
      const transaction = await this._tryCreate(userId, dto);
      this._logger.log(
        `Transaction ${transaction.id} created by user ${userId}`,
      );

      return {
        transaction,
        message: transactionResponseMessageBuilder(transaction.label, 'create'),
      };
    } catch (error) {
      this._logger.warn(
        `Error while creating transaction for user ${userId}. Error message: ${error.message}`,
      );
    }
  }

  @Get()
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Получение всех транзакций с фильтрацией и пагинацией',
    apiResponses: {
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
      ok: {
        type: PagedFinancesTransactionResponse,
        description: 'Транзакции получены успешно',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  @ApiQuery({
    name: 'page',
    description: 'Номер страницы',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Количество транзакций на странице',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'category-id',
    description: 'ID категории транзакции',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'type',
    description: 'Тип транзакции',
    required: false,
    enum: FinancesTransactionType,
  })
  public async getAll(
    @UseUser('id') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('category-id') categoryId?: string,
    @Query('type') type?: FinancesTransactionType,
  ) {
    const pagedRequest: PagedRequest = { page: +page, pageSize: +limit };

    try {
      this._logger.log(
        `Getting transactions for user ${userId} with paged request ${JSON.stringify(pagedRequest)}`,
      );
      const transactions = await this._tryGetPaged(
        userId,
        pagedRequest,
        categoryId,
        type,
      );
      this._logger.log(
        `Transactions for user ${userId} received with paged request ${JSON.stringify(pagedRequest)}`,
      );

      return transactions;
    } catch (error) {
      this._logger.warn(
        `Error while getting transactions for user ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Получение транзакции с отклонением от среднего',
    apiResponses: {
      notFound: {
        type: NotFoundResponse,
        description: notFoundResponseDescription,
      },
      ok: {
        type: FinancesTransactionResponse,
        description: 'Транзакция получена успешно',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async getOne(
    @UseUser('id') userId: string,
    @Param('id') financesTransactionId: string,
  ) {
    try {
      this._logger.log(
        `Getting transaction with id: ${financesTransactionId} for user ${userId}`,
      );
      const transaction = await this._tryGetOne(userId, financesTransactionId);
      this._logger.log(
        `Transaction with id: ${financesTransactionId} for user ${userId} received`,
      );

      return transaction;
    } catch (error) {
      this._logger.warn(
        `Error while getting transaction with id: ${financesTransactionId} for user ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Put('/:id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Обновление транзакции',
    apiResponses: {
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
      ok: {
        type: UpdateTransactionOkResponse,
        description: 'Транзакция успешно обновлена',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: 'Транзакция не была найдена у пользователя',
      },
    },
  })
  public async update(
    @UseUser('id') userId: string,
    @Param('id') financesTransactionId: string,
    @Body() dto: UpdateFinanceTransactionDto,
  ) {
    try {
      this._logger.log(
        `Updating transaction with id: ${financesTransactionId} for user ${userId}`,
      );
      const transaction = await this._tryUpdate(
        userId,
        financesTransactionId,
        dto,
      );
      this._logger.log(
        `Transaction with id: ${financesTransactionId} for user ${userId} updated`,
      );

      return {
        transaction,
        message: transactionResponseMessageBuilder(transaction.label, 'update'),
      };
    } catch (error) {
      this._logger.warn(
        `Error while updating transaction with id: ${financesTransactionId} for user ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Удаление транзакции',
    apiResponses: {
      ok: {
        type: MessageResponse,
        description: 'Транзакция успешно удалена',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: 'Транзакция не была найдена у пользователя',
      },
    },
  })
  public async delete(
    @UseUser('id') userId: string,
    @Param('id') financesTransactionId: string,
  ) {
    try {
      this._logger.log(
        `Deleting transaction with id: ${financesTransactionId} for user ${userId}`,
      );
      const { label } = await this._tryDelete(userId, financesTransactionId);
      this._logger.log(
        `Transaction with id: ${financesTransactionId} for user ${userId} deleted`,
      );

      return { message: transactionResponseMessageBuilder(label, 'delete') };
    } catch (error) {
      this._logger.warn(
        `Error while deleting transaction with id: ${financesTransactionId} for user ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  private async _tryCreate(userId: string, dto: CreateFinanceTransactionDto) {
    const transaction = await this._financesTransactionService.create(
      userId,
      dto,
    );

    return transaction;
  }

  private async _tryGetPaged(
    userId: string,
    pagedRequest: PagedRequest,
    categoryId?: string,
    type?: FinancesTransactionType,
  ) {
    const transactions =
      await this._financesTransactionService.getAllByFiltersPaged(
        pagedRequest,
        { userId, categoryId, type },
      );

    return transactions;
  }

  private async _tryGetOne(userId: string, financesTransactionId: string) {
    const transaction =
      await this._financesTransactionService.getOneWithMeanAndDeviation(
        userId,
        financesTransactionId,
      );

    return transaction;
  }

  private async _tryUpdate(
    userId: string,
    financesTransactionId: string,
    dto: UpdateFinanceTransactionDto,
  ) {
    const transaction = await this._financesTransactionService.update(
      userId,
      financesTransactionId,
      dto,
    );

    return transaction;
  }

  private async _tryDelete(userId: string, financesTransactionId: string) {
    const transaction = await this._financesTransactionService.delete(
      userId,
      financesTransactionId,
    );

    return transaction;
  }
}
