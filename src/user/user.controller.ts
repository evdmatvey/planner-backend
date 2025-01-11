import {
  Body,
  Controller,
  HttpCode,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { UseUser } from '@/auth/decorators/use-user.decorator';
import { UserMessageConstants } from './constants/user-message.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user/profile')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Put()
  @Auth()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
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
