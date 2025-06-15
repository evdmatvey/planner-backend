import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import { CreateFinancesCategoryDto } from './dto/create-finances-category.dto';
import { UpdateFinancesCategoryDto } from './dto/update-finances-category.dto';
import { FinancesCategoryService } from './finances-category.service';
import { financesCategoryResponseMessageBuilder } from './lib/finances-category-response-message-builder';
import {
  CreateFinancesCategoryOkResponse,
  FinancesCategoryOkResponse,
  FinancesCategoryRouteConstants,
  GetAllCategoryOkResponse,
  UpdateFinancesCategoryOkResponse,
} from './swagger';

@Auth()
@ApiBearerAuth()
@ApiTags('Категории транзакций')
@UsePipes(new ValidationPipe())
@Controller('finances-category')
export class FinancesCategoryController {
  public constructor(
    private readonly _financesCategoryService: FinancesCategoryService,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Получение всех категорий транзакций пользователя',
    apiResponses: {
      ok: {
        type: GetAllCategoryOkResponse,
        description: FinancesCategoryRouteConstants.GET_ALL.OK,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async getAll(@UseUser('id') userId: string) {
    const categories = await this._financesCategoryService.getAll(userId);

    return { categories };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Получение категории транзакций пользователя по id',
    apiResponses: {
      ok: {
        type: FinancesCategoryOkResponse,
        description: FinancesCategoryRouteConstants.GET_ONE.OK,
      },
      notFound: {
        type: NotFoundResponse,
        description: notFoundResponseDescription,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async getOne(@UseUser('id') userId: string, @Param('id') id: string) {
    const category = await this._financesCategoryService.getById(id, userId);

    return { category };
  }

  @Post()
  @HttpCode(201)
  @ApiRouteDocs({
    summary: 'Создание категории транзакций пользователя',
    apiResponses: {
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
      ok: {
        type: CreateFinancesCategoryOkResponse,
        description: FinancesCategoryRouteConstants.CREATE.OK,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async create(
    @UseUser('id') userId: string,
    @Body() dto: CreateFinancesCategoryDto,
  ) {
    const category = await this._financesCategoryService.create(userId, dto);

    return {
      category,
      message: financesCategoryResponseMessageBuilder(category.title, 'create'),
    };
  }

  @Put(':id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Обновление категории транзакций пользователя',
    apiResponses: {
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: notFoundResponseDescription,
      },
      ok: {
        type: UpdateFinancesCategoryOkResponse,
        description: FinancesCategoryRouteConstants.UPDATE.OK,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async update(
    @UseUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFinancesCategoryDto,
  ) {
    const category = await this._financesCategoryService.update(
      id,
      userId,
      dto,
    );

    return {
      category,
      message: financesCategoryResponseMessageBuilder(category.title, 'update'),
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Удаление категории транзакций пользователя',
    apiResponses: {
      ok: {
        type: MessageResponse,
        description: FinancesCategoryRouteConstants.REMOVE.OK,
      },
      notFound: {
        type: NotFoundResponse,
        description: notFoundResponseDescription,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async delete(@UseUser('id') userId: string, @Param('id') id: string) {
    const category = await this._financesCategoryService.delete(id, userId);

    return {
      message: financesCategoryResponseMessageBuilder(category.title, 'delete'),
    };
  }
}
