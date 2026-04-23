import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { UserMessageConstants } from './constants/user-message.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UpdateUserOkResponse,
  UserResponse,
  UserRouteConstants,
  UserSummaryConstants,
} from './swagger';
import { UserService } from './user.service';
import { removePasswordFromUser } from './utils/remove-password-from-user.util';

@Auth()
@ApiBearerAuth()
@ApiTags('Профиль пользователя')
@UsePipes(new ValidationPipe())
@Controller('user/profile')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  @HttpCode(200)
  @ApiRouteDocs({
    summary: UserSummaryConstants.GET_PROFILE,
    apiResponses: {
      ok: {
        type: UserResponse,
        description: UserRouteConstants.GET_PROFILE.OK,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async getProfile(@UseUser('id') userId: string) {
    const user = await this._userService.getById(userId);

    return removePasswordFromUser(user);
  }

  @Put()
  @HttpCode(200)
  @ApiRouteDocs({
    summary: UserSummaryConstants.UPDATE,
    apiResponses: {
      ok: {
        type: UpdateUserOkResponse,
        description: UserRouteConstants.UPDATE.OK,
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
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this._userService.update(userId, dto);

    return {
      user: removePasswordFromUser(user),
      message: UserMessageConstants.SUCCESS_UPDATE,
    };
  }
}
