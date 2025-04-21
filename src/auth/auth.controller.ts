import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Turnstile } from 'nestjs-cloudflare-captcha';
import {
  BadRequestResponse,
  badRequestResponseDescription,
} from '@/shared/swagger-types/badrequest-response';
import { ConflictResponse } from '@/shared/swagger-types/conflict-response';
import { MessageResponse } from '@/shared/swagger-types/message-response';
import { NotFoundResponse } from '@/shared/swagger-types/notfound-response';
import { AuthMessageConstants } from './constants/auth-message.constants';
import { LoginBody, LoginDto } from './dto/login.dto';
import { RegisterBody, RegisterDto } from './dto/register.dto';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import {
  AuthLoginUnauthorizedResponse,
  AuthOkResponse,
  AuthOkResponseWithMessage,
  AuthUnauthorizedResponse,
} from './types';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _tokenService: TokenService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @Turnstile()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Авторизация' })
  @ApiOkResponse({
    type: AuthOkResponseWithMessage,
    description: 'Успешно авторизован',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: badRequestResponseDescription,
  })
  @ApiUnauthorizedResponse({ type: AuthLoginUnauthorizedResponse })
  public async login(
    @Body() body: LoginBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dto = this._removeCaptchaTokenFromBody(body) as LoginDto;
    const user = await this._authService.login(dto);
    const { accessToken, refreshToken } = this._tokenService.createTokens(
      user.id,
    );

    this._tokenService.addRefreshTokenToResponse(res, refreshToken);

    return {
      user,
      accessToken,
      message: AuthMessageConstants.SUCCESS_LOGIN,
    };
  }

  @Post('register')
  @HttpCode(201)
  @Turnstile()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Регистрация' })
  @ApiCreatedResponse({
    type: AuthOkResponseWithMessage,
    description: 'Аккаунт успешно создан',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: badRequestResponseDescription,
  })
  @ApiConflictResponse({
    type: ConflictResponse,
    description:
      'Регистрация требует уникальный email. Не должно быть пользователей с одинаковым email',
  })
  public async register(
    @Body() body: RegisterBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dto = this._removeCaptchaTokenFromBody(body) as RegisterDto;
    const user = await this._authService.register(dto);
    const { accessToken, refreshToken } = this._tokenService.createTokens(
      user.id,
    );

    this._tokenService.addRefreshTokenToResponse(res, refreshToken);

    return {
      user,
      accessToken,
      message: AuthMessageConstants.SUCCESS_REGISTER,
    };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiOkResponse({
    type: MessageResponse,
    description: 'Успешный выход из системы',
  })
  public async logout(@Res({ passthrough: true }) res: Response) {
    this._tokenService.removeRefreshTokenFromResponse(res);

    return {
      message: AuthMessageConstants.SUCCESS_LOGOUT,
    };
  }

  @Post('login/access-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Получение нового access токена по refresh' })
  @ApiOkResponse({
    type: AuthOkResponse,
    description: 'Токены успешно обновлены',
  })
  @ApiNotFoundResponse({
    type: NotFoundResponse,
    description: 'Пользователь с id из refresh token не найден',
  })
  @ApiUnauthorizedResponse({ type: AuthUnauthorizedResponse })
  public async getNewToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies =
      this._tokenService.getRefreshTokenFromRequest(req, res);

    const userId: string = await this._tokenService.verifyRefreshToken(
      refreshTokenFromCookies,
    );
    const user = await this._authService.getUserById(userId);

    const { refreshToken, accessToken } =
      this._tokenService.createTokens(userId);

    this._tokenService.addRefreshTokenToResponse(res, refreshToken);

    return {
      user,
      accessToken,
    };
  }

  private _removeCaptchaTokenFromBody(
    body: LoginBody | RegisterBody,
  ): LoginDto | RegisterDto {
    const { captchaToken, ...dto } = body;

    return dto;
  }
}
