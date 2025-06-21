import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { UserMessageConstants } from './constants/user-message.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UpdateUserOkResponse,
  UserResponse,
} from './types/user-response.types';
import { UserService } from './user.service';
import { removePasswordFromUser } from './utils/remove-password-from-user.util';

@Auth()
@ApiBearerAuth()
@ApiTags('Профиль пользователя')
@UsePipes(new ValidationPipe())
@Controller('user/profile')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _logger: Logger,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Получение профиля пользователя' })
  @ApiOkResponse({
    type: UserResponse,
    description: 'Пользователь успешно получен',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
  })
  public async getProfile(@UseUser('id') userId: string) {
    try {
      this._logger.log(`Get user with id: ${userId}`);
      const user = await this._tryGetUser(userId);
      this._logger.log(`User with id: ${userId} successfully received`);

      return removePasswordFromUser(user);
    } catch (error) {
      this._logger.warn(
        `Error while getting user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Put()
  @HttpCode(200)
  @ApiOperation({ summary: 'Обновление профиля пользователя' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
  })
  @ApiOkResponse({
    type: UpdateUserOkResponse,
    description: 'Профиль пользователя успешно обновлён',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: badRequestResponseDescription,
  })
  public async update(
    @UseUser('id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    try {
      this._logger.log(`Update user with id: ${userId}`);
      const user = await this._tryUpdateUser(userId, dto);
      this._logger.log(`User with id: ${userId} successfully updated`);

      return {
        user,
        message: UserMessageConstants.SUCCESS_UPDATE,
      };
    } catch (error) {
      this._logger.warn(
        `Error while updating user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  private async _tryGetUser(userId: string) {
    const user = await this._userService.getById(userId);

    return user;
  }

  private async _tryUpdateUser(userId: string, dto: UpdateUserDto) {
    const { password, ...user } = await this._userService.update(userId, dto);

    return user;
  }
}
