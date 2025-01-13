import {
  Body,
  Controller,
  Get,
  HttpCode,
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

@ApiBearerAuth()
@ApiTags('Профиль пользователя')
@Controller('user/profile')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  @Auth()
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
    const user = await this._userService.getById(userId);

    return removePasswordFromUser(user);
  }

  @Put()
  @Auth()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
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
    const { password, ...user } = await this._userService.update(userId, dto);

    return {
      user,
      message: UserMessageConstants.SUCCESS_UPDATE,
    };
  }
}
