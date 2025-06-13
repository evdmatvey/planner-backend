import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
    const transaction = await this._financesTransactionService.create(
      userId,
      dto,
    );
    const message = transactionResponseMessageBuilder(
      transaction.label,
      'create',
    );

    return {
      transaction,
      message,
    };
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

    return this._financesTransactionService.getAllByFiltersPaged(pagedRequest, {
      userId,
      categoryId,
      type,
    });
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
    return this._financesTransactionService.getOneWithMeanAndDeviation(
      userId,
      financesTransactionId,
    );
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
    const transaction = await this._financesTransactionService.update(
      userId,
      financesTransactionId,
      dto,
    );
    const message = transactionResponseMessageBuilder(
      transaction.label,
      'update',
    );

    return {
      transaction,
      message,
    };
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
    const { label } = await this._financesTransactionService.delete(
      userId,
      financesTransactionId,
    );
    const message = transactionResponseMessageBuilder(label, 'delete');

    return { message };
  }
}
