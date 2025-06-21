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
import { Auth } from '@/auth/decorators/auth.decorator';
import { UseUser } from '@/auth/decorators/use-user.decorator';
import { ApiRouteDocs } from '@/shared/swagger';
import {
  BadRequestResponse,
  badRequestResponseDescription,
} from '@/shared/swagger-types/badrequest-response';
import {
  UnauthorizedResponse,
  unauthorizedResponseDescription,
} from '@/shared/swagger-types/unauthorized-response';
import { TagMessageConstants } from './constants/tag-message.constants';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';
import {
  TagResponse,
  TagWithMessageResponse,
} from './types/tag-response.types';

@Auth()
@ApiBearerAuth()
@ApiTags('Тэги')
@UsePipes(new ValidationPipe())
@Controller('tags')
export class TagController {
  public constructor(
    private readonly _tagService: TagService,
    private readonly _logger: Logger,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Получение тегов',
    apiResponses: {
      ok: {
        type: TagResponse,
        description: 'Теги успешно получены',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async getAll(@UseUser('id') userId: string) {
    try {
      this._logger.log(`Get all tags for user with id: ${userId}`);
      const tags = await this._tryGetTags(userId);
      this._logger.log(
        `Tags for user with id: ${userId} successfully received`,
      );

      return { tags };
    } catch (error) {
      this._logger.warn(
        `Error while getting tags for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Получение тега по id',
    apiResponses: {
      ok: {
        type: TagResponse,
        description: 'Тег успешно получен',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async getOne(
    @UseUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    try {
      this._logger.log(
        `Get tag with id: ${taskId} for user with id: ${userId}`,
      );
      const tag = await this._tryGetTag(userId, taskId);
      this._logger.log(`Tag with id: ${taskId} successfully received`);

      return { tag };
    } catch (error) {
      this._logger.warn(
        `Error while getting tag with id: ${taskId} for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Post()
  @HttpCode(201)
  @ApiRouteDocs({
    summary: 'Создание тега',
    apiResponses: {
      ok: {
        type: TagWithMessageResponse,
        description: 'Тег успешно создан',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
    },
  })
  public async create(
    @UseUser('id') userId: string,
    @Body() dto: CreateTagDto,
  ) {
    try {
      this._logger.log(
        `Create tag for user with id: ${userId} with title: ${dto.title}`,
      );
      const tag = await this._tryCreateTag(userId, dto);
      this._logger.log(
        `Tag with id: ${tag.id} successfully created for user with id: ${userId}`,
      );

      return {
        tag,
        message: TagMessageConstants.SUCCESS_CREATE,
      };
    } catch (error) {
      this._logger.warn(
        `Error while creating tag for user with id: ${userId} with title: ${dto.title}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Обновление тега',
    apiResponses: {
      ok: {
        type: TagWithMessageResponse,
        description: 'Тег успешно обновлен',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
    },
  })
  public async update(
    @UseUser('id') userId: string,
    @Param('id') tagId: string,
    @Body() dto: UpdateTagDto,
  ) {
    try {
      this._logger.log(
        `Update tag with id: ${tagId} for user with id: ${userId} with title: ${dto.title}`,
      );
      const tag = await this._tryUpdateTag(userId, tagId, dto);
      this._logger.log(
        `Tag with id: ${tag.id} successfully updated for user with id: ${userId}`,
      );

      return {
        tag,
        message: TagMessageConstants.SUCCESS_UPDATE,
      };
    } catch (error) {
      this._logger.warn(
        `Error while updating tag with id: ${tagId} for user with id: ${userId} with title: ${dto.title}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Удаление тега',
    apiResponses: {
      ok: {
        type: TagWithMessageResponse,
        description: 'Тег успешно удален',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async delete(
    @UseUser('id') userId: string,
    @Param('id') tagId: string,
  ) {
    try {
      this._logger.log(
        `Delete tag with id: ${tagId} for user with id: ${userId}`,
      );
      const tag = await this._tryDeleteTag(userId, tagId);
      this._logger.log(
        `Tag with id: ${tag.id} successfully deleted for user with id: ${userId}`,
      );

      return {
        tag,
        message: TagMessageConstants.SUCCESS_DELETE,
      };
    } catch (error) {
      this._logger.warn(
        `Error while deleting tag with id: ${tagId} for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  private async _tryGetTags(userId: string) {
    const tags = await this._tagService.getAll(userId);

    return tags;
  }

  private async _tryGetTag(userId: string, tagId: string) {
    const tag = await this._tagService.getById(userId, tagId);

    return tag;
  }

  private async _tryCreateTag(userId: string, dto: CreateTagDto) {
    const tag = await this._tagService.create(userId, dto);

    return tag;
  }

  private async _tryUpdateTag(
    userId: string,
    tagId: string,
    dto: UpdateTagDto,
  ) {
    const tag = await this._tagService.update(userId, tagId, dto);

    return tag;
  }

  private async _tryDeleteTag(userId: string, tagId: string) {
    const tag = await this._tagService.delete(userId, tagId);

    return tag;
  }
}
