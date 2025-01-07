import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { UserModule, UserService } from '@/user';
import { AuthMessageConstants } from '../constants/auth-message.constants';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from './auth.service';

jest.mock('argon2');

describe('AuthService', () => {
  const mockUserService = {
    getByEmail: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
  };

  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [AuthService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('getUserById', () => {
    it('should return user data without password if user exists', async () => {
      const userId = '1';
      const user = {
        id: userId,
        email: 'test@example.com',
        password: 'hashed_password',
      };

      mockUserService.getById.mockResolvedValue(user);

      const result = await service.getUserById(userId);
      expect(result).toEqual({ id: userId, email: user.email });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = '1';

      mockUserService.getById.mockResolvedValue(null);

      await expect(service.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getUserById(userId)).rejects.toThrow(
        AuthMessageConstants.USER_NOT_FOUND,
      );
    });
  });

  describe('register', () => {
    it('should create a new user and return user data without password', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password',
        passwordRepeat: 'password',
      };
      const userToCreate = {
        email: registerDto.email,
        password: 'hashed_password',
      };
      const createdUser = { id: '2', ...userToCreate };

      mockUserService.getByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);
      expect(result).toEqual({ id: '2', email: registerDto.email });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existinguser@example.com',
        password: 'password',
        passwordRepeat: 'password',
      };

      mockUserService.getByEmail.mockResolvedValue(true);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        AuthMessageConstants.USER_ALREADY_EXIST,
      );
    });
  });

  describe('login', () => {
    it('should return user data without password on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password',
      };

      mockUserService.getByEmail.mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      mockUserService.getByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        AuthMessageConstants.INCORRECT_CREDENTIALS,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password',
      };

      mockUserService.getByEmail.mockResolvedValue(user);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        AuthMessageConstants.INCORRECT_CREDENTIALS,
      );
    });
  });
});
