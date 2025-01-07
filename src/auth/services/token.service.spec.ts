import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { AuthMessageConstants } from '../constants/auth-message.constants';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('localhost'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addRefreshTokenToResponse', () => {
    it('should set a refresh token cookie in the response', () => {
      const res = {
        cookie: jest.fn(),
      } as unknown as Response;

      const refreshToken = 'sample_refresh_token';
      tokenService.addRefreshTokenToResponse(res, refreshToken);

      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken,
        expect.objectContaining({
          httpOnly: true,
          domain: 'localhost',
          sameSite: 'none',
          secure: true,
        }),
      );
    });
  });

  describe('removeRefreshTokenFromResponse', () => {
    it('should remove the refresh token cookie from the response', () => {
      const res = {
        cookie: jest.fn(),
      } as unknown as Response;

      tokenService.removeRefreshTokenFromResponse(res);

      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        '',
        expect.objectContaining({
          httpOnly: true,
          domain: 'localhost',
          expires: new Date(0),
          sameSite: 'none',
          secure: true,
        }),
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should return user id if the refresh token is valid', async () => {
      const refreshToken = 'valid_refresh_token';
      const decoded = { id: 'userId' };

      mockJwtService.verifyAsync.mockResolvedValue(decoded);

      const result = await tokenService.verifyRefreshToken(refreshToken);
      expect(result).toEqual(decoded.id);
    });

    it('should throw UnauthorizedException if the refresh token is invalid', async () => {
      const refreshToken = 'invalid_refresh_token';

      mockJwtService.verifyAsync.mockResolvedValue(null);

      await expect(
        tokenService.verifyRefreshToken(refreshToken),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        tokenService.verifyRefreshToken(refreshToken),
      ).rejects.toThrow(AuthMessageConstants.NO_ACCESS);
    });
  });

  describe('getRefreshTokenFromRequest', () => {
    it('should return the refresh token from request cookies', () => {
      const req = {
        cookies: {
          refreshToken: 'sample_refresh_token',
        },
      } as unknown as Request;

      const res = {} as Response;

      const result = tokenService.getRefreshTokenFromRequest(req, res);
      expect(result).toEqual('sample_refresh_token');
    });

    it('should remove the refresh token cookie and throw UnauthorizedException if no refresh token is found', () => {
      const req = {
        cookies: {},
      } as unknown as Request;

      const res = {
        cookie: jest.fn(),
      } as unknown as Response;

      expect(() => tokenService.getRefreshTokenFromRequest(req, res)).toThrow(
        UnauthorizedException,
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        '',
        expect.objectContaining({
          httpOnly: true,
          domain: 'localhost',
          expires: new Date(0),
          sameSite: 'none',
          secure: true,
        }),
      );
    });
  });

  describe('createTokens', () => {
    it('should create access and refresh tokens for a given user id', () => {
      const userId = 'userId';

      mockJwtService.sign
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');

      const result = tokenService.createTokens(userId);

      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });
  });
});
