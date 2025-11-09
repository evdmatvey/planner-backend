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
  public constructor(private readonly _tagService: TagService) {}

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
    const tags = await this._tagService.getAll(userId);

    return { tags };
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
    @Param('id') tagId: string,
  ) {
    const tag = await this._tagService.getById(userId, tagId);

    return { tag };
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
    const tag = await this._tagService.create(userId, dto);

    return {
      tag,
      message: TagMessageConstants.SUCCESS_CREATE,
    };
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
    const tag = await this._tagService.update(userId, tagId, dto);

    return {
      tag,
      message: TagMessageConstants.SUCCESS_UPDATE,
    };
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
    const tag = await this._tagService.delete(userId, tagId);

    return {
      tag,
      message: TagMessageConstants.SUCCESS_DELETE,
    };
  }
}
