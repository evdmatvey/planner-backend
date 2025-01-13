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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { UseUser } from '@/auth/decorators/use-user.decorator';
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

@ApiBearerAuth()
@ApiTags('Тэги')
@Controller('tags')
export class TagController {
  public constructor(private readonly _tagService: TagService) {}

  @Get()
  @Auth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Получение тегов' })
  @ApiOkResponse({ type: TagResponse, isArray: true })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
  })
  public async getAll(@UseUser('id') userId: string) {
    const tags = await this._tagService.getAll(userId);

    return {
      tags,
    };
  }

  @Get(':id')
  @Auth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Получение тега по id' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
  })
  public async getOne(
    @UseUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    const tag = await this._tagService.getById(userId, taskId);

    return {
      tag,
    };
  }

  @Post()
  @Auth()
  @HttpCode(201)
  @ApiOperation({ summary: 'Создание тега' })
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ type: TagWithMessageResponse })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: badRequestResponseDescription,
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
  @Auth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Обновление тега' })
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ type: TagWithMessageResponse })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: badRequestResponseDescription,
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
  @Auth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Удаление тега' })
  @ApiOkResponse({ type: TagWithMessageResponse })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
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
