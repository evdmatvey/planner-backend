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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthMessageConstants } from './constants/auth-message.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import {
  AuthBadRequestResponse,
  AuthLoginUnauthorizedResponse,
  AuthMessageResponse,
  AuthNotFoundResponse,
  AuthOkResponse,
  AuthOkResponseWithMessage,
  AuthRegisterConflictResponse,
  AuthUnauthorizedResponse,
} from './types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _tokenService: TokenService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ type: AuthOkResponseWithMessage })
  @ApiBadRequestResponse({ type: AuthBadRequestResponse })
  @ApiUnauthorizedResponse({ type: AuthLoginUnauthorizedResponse })
  public async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
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
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ type: AuthOkResponseWithMessage })
  @ApiBadRequestResponse({ type: AuthBadRequestResponse })
  @ApiConflictResponse({ type: AuthRegisterConflictResponse })
  public async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
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
  @ApiOkResponse({ type: AuthMessageResponse })
  public async logout(@Res({ passthrough: true }) res: Response) {
    this._tokenService.removeRefreshTokenFromResponse(res);

    return {
      message: AuthMessageConstants.SUCCESS_LOGOUT,
    };
  }

  @Post('login/access-token')
  @HttpCode(200)
  @ApiOkResponse({ type: AuthOkResponse })
  @ApiNotFoundResponse({ type: AuthNotFoundResponse })
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
}
