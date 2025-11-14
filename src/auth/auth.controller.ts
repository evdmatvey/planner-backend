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
} from './swagger';
import { AuthRouteConstants, AuthSummaryConstants } from './swagger/constants';

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
    summary: AuthSummaryConstants.LOGIN,
    apiResponses: {
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
      ok: {
        type: AuthOkResponseWithMessage,
        description: AuthRouteConstants.LOGIN.OK,
      },
      unauthorized: {
        type: AuthLoginUnauthorizedResponse,
        description: AuthRouteConstants.LOGIN.UNAUTHORIZED,
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
    summary: AuthSummaryConstants.REGISTER,
    apiResponses: {
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
      },
      ok: {
        type: AuthOkResponseWithMessage,
        description: AuthRouteConstants.REGISTER.OK,
      },
      conflict: {
        type: ConflictResponse,
        description: AuthRouteConstants.REGISTER.CONFLICT,
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
    summary: AuthSummaryConstants.LOGOUT,
    apiResponses: {
      ok: {
        type: MessageResponse,
        description: AuthRouteConstants.LOGOUT.OK,
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
    summary: AuthSummaryConstants.GET_NEW_TOKEN,
    apiResponses: {
      ok: {
        type: AuthOkResponse,
        description: AuthRouteConstants.GET_NEW_TOKEN.OK,
      },
      unauthorized: {
        type: AuthUnauthorizedResponse,
        description: AuthRouteConstants.GET_NEW_TOKEN.UNAUTHORIZED,
      },
      notFound: {
        type: NotFoundResponse,
        description: AuthRouteConstants.GET_NEW_TOKEN.NOT_FOUND,
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
