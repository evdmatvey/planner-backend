import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthMessageConstants } from './constants/auth-message.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

jest.mock('nestjs-cloudflare-captcha', () => ({
  // eslint-disable-next-line
  Turnstile: () => (target, key, descriptor) => descriptor,
}));

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    getUserById: jest.fn(),
  };

  const mockTokenService = {
    createTokens: jest.fn(),
    addRefreshTokenToResponse: jest.fn(),
    removeRefreshTokenFromResponse: jest.fn(),
    verifyRefreshToken: jest.fn(),
    getRefreshTokenFromRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return user and tokens on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = { id: '1', email: 'test@example.com' };
      const tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };
      const res = { cookie: jest.fn() } as unknown as Response;

      mockAuthService.login.mockResolvedValue(user);
      mockTokenService.createTokens.mockReturnValue(tokens);

      const result = await authController.login(
        { ...loginDto, captchaToken: 'token' },
        res,
      );

      expect(result).toEqual({
        user,
        accessToken: tokens.accessToken,
        message: AuthMessageConstants.SUCCESS_LOGIN,
      });
      expect(mockTokenService.addRefreshTokenToResponse).toHaveBeenCalledWith(
        res,
        tokens.refreshToken,
      );
    });

    it('should throw UnauthorizedException on login failure', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      await expect(
        authController.login(
          { ...loginDto, captchaToken: 'token' },
          {} as Response,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should return user and tokens on successful registration', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password',
        passwordRepeat: 'password',
      };
      const user = { id: '2', email: 'newuser@example.com' };
      const tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };
      const res = { cookie: jest.fn() } as unknown as Response;

      mockAuthService.register.mockResolvedValue(user);
      mockTokenService.createTokens.mockReturnValue(tokens);

      const result = await authController.register(
        { ...registerDto, captchaToken: 'token' },
        res,
      );

      expect(result).toEqual({
        user,
        accessToken: tokens.accessToken,
        message: AuthMessageConstants.SUCCESS_REGISTER,
      });
      expect(mockTokenService.addRefreshTokenToResponse).toHaveBeenCalledWith(
        res,
        tokens.refreshToken,
      );
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existinguser@example.com',
        password: 'password',
        passwordRepeat: 'password',
      };

      mockAuthService.register.mockRejectedValue(new ConflictException());

      await expect(
        authController.register(
          { ...registerDto, captchaToken: 'token' },
          {} as Response,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('logout', () => {
    it('should remove refresh token and return success message', async () => {
      const res = { cookie: jest.fn() } as unknown as Response;

      const result = await authController.logout(res);

      expect(result).toEqual({
        message: AuthMessageConstants.SUCCESS_LOGOUT,
      });
      expect(
        mockTokenService.removeRefreshTokenFromResponse,
      ).toHaveBeenCalledWith(res);
    });
  });

  describe('getNewToken', () => {
    it('should return new access token and user data on valid refresh token', async () => {
      const req = {
        cookies: {
          refreshToken: 'valid_refresh_token',
        },
      } as unknown as Request;

      const res = {} as Response;
      const userId = '1';
      const user = { id: userId, email: 'test@example.com' };

      mockTokenService.getRefreshTokenFromRequest.mockReturnValue(
        'valid_refresh_token',
      );
      mockTokenService.verifyRefreshToken.mockResolvedValue(userId);
      mockAuthService.getUserById.mockResolvedValue(user);

      const tokens = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      };

      mockTokenService.createTokens.mockReturnValue(tokens);

      const result = await authController.getNewToken(req, res);

      expect(result).toEqual({
        user,
        accessToken: tokens.accessToken,
      });

      expect(mockTokenService.addRefreshTokenToResponse).toHaveBeenCalledWith(
        res,
        tokens.refreshToken,
      );
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const req = {} as Request;

      mockTokenService.getRefreshTokenFromRequest.mockImplementation(() => {
        throw new UnauthorizedException();
      });

      await expect(
        authController.getNewToken(req, {} as Response),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const req = {
        cookies: {
          refreshToken: 'valid_refresh_token',
        },
      } as unknown as Request;

      mockTokenService.getRefreshTokenFromRequest.mockReturnValue(
        'valid_refresh_token',
      );
      mockTokenService.verifyRefreshToken.mockResolvedValue('1');
      mockAuthService.getUserById.mockImplementation(() => {
        throw new NotFoundException(AuthMessageConstants.USER_NOT_FOUND);
      });

      await expect(
        authController.getNewToken(req, {} as Response),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
