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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { UseUser } from '@/auth/decorators/use-user.decorator';
import { UserMessageConstants } from './constants/user-message.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UnauthorizedResponse,
  UpdateUserOkResponse,
  UserBadRequestResponse,
  UserResponse,
} from './types/user-response.types';
import { UserService } from './user.service';
import { removePasswordFromUser } from './utils/remove-password-from-user.util';

@ApiBearerAuth()
@Controller('user/profile')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  @Auth()
  @HttpCode(200)
  @ApiOkResponse({ type: UserResponse })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse })
  public async getProfile(@UseUser('id') userId: string) {
    const user = await this._userService.getById(userId);

    return removePasswordFromUser(user);
  }

  @Put()
  @Auth()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse })
  @ApiOkResponse({ type: UpdateUserOkResponse })
  @ApiBadRequestResponse({ type: UserBadRequestResponse })
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
