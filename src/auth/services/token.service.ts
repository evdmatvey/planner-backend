import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthMessageConstants } from '../constants/auth-message.constants';
import { Tokens } from '../types';

@Injectable()
export class TokenService {
  private REFRESH_TOKEN_NAME = 'refreshToken';
  private EXPIRE_DAY_REFRESH_TOKEN = 1;

  public constructor(
    private readonly _jwt: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  public addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this._configService.getOrThrow('APPLICATION_HOST'),
      expires: expiresIn,
      sameSite: 'none',
      secure: true,
    });
  }

  public removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this._configService.getOrThrow('APPLICATION_HOST'),
      expires: new Date(0),
      sameSite: 'none',
      secure: true,
    });
  }

  public async verifyRefreshToken(refreshToken: string): Promise<string> {
    const result = await this._jwt.verifyAsync(refreshToken);

    if (!result)
      throw new UnauthorizedException(AuthMessageConstants.NO_ACCESS);

    return result.id;
  }

  public getRefreshTokenFromRequest(req: Request, res: Response): string {
    const refreshTokenFromCookies = req.cookies[this.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookies) {
      this.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException(
        AuthMessageConstants.NOT_FOUND_REFRESH_TOKEN,
      );
    }

    return refreshTokenFromCookies;
  }

  public createTokens(userId: string): Tokens {
    const data = { id: userId };

    const accessToken = this._jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this._jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
