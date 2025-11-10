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
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Turnstile } from 'nestjs-cloudflare-captcha';
import { ApiRouteDocs } from '@/shared/swagger';
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
@UsePipes(new ValidationPipe())
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _tokenService: TokenService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @Turnstile()
  @ApiRouteDocs({
    summary: 'Авторизация',
    apiResponses: {
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
      ok: {
        type: AuthOkResponseWithMessage,
        description: 'Успешно авторизован',
      },
      unauthorized: {
        type: AuthLoginUnauthorizedResponse,
        description: 'Неверный логин или пароль',
      },
    },
  })
  public async login(
    @Body() body: LoginBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dto = this._removeCaptchaTokenFromBody(body) as LoginDto;
    const user = await this._authService.login(dto);
    const { refreshToken, accessToken } = this._tokenService.createTokens(
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
  @ApiRouteDocs({
    summary: 'Регистрация',
    apiResponses: {
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
      ok: {
        type: AuthOkResponseWithMessage,
        description: 'Аккаунт успешно создан',
      },
      unauthorized: {
        type: AuthLoginUnauthorizedResponse,
        description: 'Неверный логин или пароль',
      },
      conflict: {
        type: ConflictResponse,
        description:
          'Регистрация требует уникальный email. Не должно быть пользователей с одинаковым email',
      },
    },
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
  @ApiRouteDocs({
    summary: 'Выход из системы',
    apiResponses: {
      ok: {
        type: MessageResponse,
        description: 'Успешный выход из системы',
      },
    },
  })
  public async logout(@Res({ passthrough: true }) res: Response) {
    this._tokenService.removeRefreshTokenFromResponse(res);

    return {
      message: AuthMessageConstants.SUCCESS_LOGOUT,
    };
  }

  @Post('login/access-token')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Получение нового access токена по refresh',
    apiResponses: {
      ok: {
        type: AuthOkResponse,
        description: 'Токены успешно обновлены',
      },
      unauthorized: {
        type: AuthUnauthorizedResponse,
        description: 'Неверный refresh токен',
      },
      notFound: {
        type: NotFoundResponse,
        description: 'Пользователь с id из refresh token не найден',
      },
    },
  })
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

    return { user, accessToken };
  }

  private _removeCaptchaTokenFromBody(
    body: LoginBody | RegisterBody,
  ): LoginDto | RegisterDto {
    const { captchaToken, ...dto } = body;

    return dto;
  }
}
