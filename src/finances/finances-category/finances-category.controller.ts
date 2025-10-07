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
    private readonly _logger: Logger,
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
    try {
      this._logger.log(`Get all categories for user with id: ${userId}`);
      const categories = await this._tryGetAll(userId);
      this._logger.log(
        `Categories for user with id: ${userId} successfully received`,
      );

      return { categories };
    } catch (error) {
      this._logger.warn(
        `Error while getting all categories for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
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
    try {
      this._logger.log(
        `Get category with id: ${id} for user with id: ${userId}`,
      );
      const category = await this._tryGetOne(userId, id);
      this._logger.log(
        `Category with id: ${id} for user with id: ${userId} successfully received`,
      );

      return { category };
    } catch (error) {
      this._logger.warn(
        `Error while getting category with id: ${id} for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
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
    try {
      this._logger.log(
        `Create category for user with id: ${userId} with title: ${dto.title}`,
      );
      const category = await this._tryCreate(userId, dto);
      this._logger.log(
        `Category for user with id: ${userId} successfully created`,
      );

      return {
        category,
        message: financesCategoryResponseMessageBuilder(
          category.title,
          'create',
        ),
      };
    } catch (error) {
      this._logger.warn(
        `Error while creating category for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
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
    try {
      this._logger.log(
        `Update category with id: ${id} for user with id: ${userId}`,
      );
      const category = await this._tryUpdate(id, userId, dto);
      this._logger.log(
        `Category with id: ${id} for user with id: ${userId} successfully updated`,
      );

      return {
        category,
        message: financesCategoryResponseMessageBuilder(
          category.title,
          'update',
        ),
      };
    } catch (error) {
      this._logger.warn(
        `Error while updating category with id: ${id} for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
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
    try {
      this._logger.log(
        `Delete category with id: ${id} for user with id: ${userId}`,
      );
      const category = await this._tryDelete(userId, id);
      this._logger.log(
        `Category with id: ${id} for user with id: ${userId} successfully deleted`,
      );

      return {
        message: financesCategoryResponseMessageBuilder(
          category.title,
          'delete',
        ),
      };
    } catch (error) {
      this._logger.warn(
        `Error while deleting category with id: ${id} for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  private async _tryGetAll(userId: string) {
    const categories = await this._financesCategoryService.getAll(userId);

    return categories;
  }

  private async _tryGetOne(userId: string, id: string) {
    const category = await this._financesCategoryService.getById(id, userId);

    return category;
  }

  private async _tryCreate(userId: string, dto: CreateFinancesCategoryDto) {
    const category = await this._financesCategoryService.create(userId, dto);

    return category;
  }

  private async _tryUpdate(
    id: string,
    userId: string,
    dto: UpdateFinancesCategoryDto,
  ) {
    const category = await this._financesCategoryService.update(
      id,
      userId,
      dto,
    );

    return category;
  }

  private async _tryDelete(userId: string, id: string) {
    const category = await this._financesCategoryService.delete(id, userId);

    return category;
  }
}
