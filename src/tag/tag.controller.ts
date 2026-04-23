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
import {
  TagResponse,
  TagRouteConstants,
  TagSummaryConstants,
  TagWithMessageResponse,
} from './swagger';
import { TagService } from './tag.service';

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
    summary: TagSummaryConstants.GET_ALL,
    apiResponses: {
      ok: {
        type: TagResponse,
        description: TagRouteConstants.GET_ALL.OK,
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
    summary: TagSummaryConstants.GET_ONE,
    apiResponses: {
      ok: {
        type: TagResponse,
        description: TagRouteConstants.GET_ONE.OK,
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
    summary: TagSummaryConstants.CREATE,
    apiResponses: {
      ok: {
        type: TagWithMessageResponse,
        description: TagRouteConstants.CREATE.OK,
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
    summary: TagSummaryConstants.UPDATE,
    apiResponses: {
      ok: {
        type: TagWithMessageResponse,
        description: TagRouteConstants.UPDATE.OK,
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
    summary: TagSummaryConstants.DELETE,
    apiResponses: {
      ok: {
        type: TagWithMessageResponse,
        description: TagRouteConstants.DELETE.OK,
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
