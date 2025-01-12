import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/__generated__';
import * as argon2 from 'argon2';
import { mockPrismaService } from '@/shared/mocks/prisma-service.mock';
import { PrismaService } from '@/shared/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

jest.mock('argon2');

describe('UserService', () => {
  let service: UserService;
  let prismaService: typeof mockPrismaService;
  let userId: string;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<typeof mockPrismaService>(PrismaService);
    userId = 'user-id';
    user = {
      id: userId,
      email: 'test@email.test',
      password: 'password123',
      name: 'name',
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  });

  describe('getByEmail', () => {
    it('should call prisma findUnique with email', async () => {
      await service.getByEmail(user.email);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: user.email },
      });
    });

    it('should return a user by email', async () => {
      prismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.getByEmail(user.email);

      expect(result).toEqual(user);
    });

    it('should return null if user not found by email', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.getByEmail(user.email);

      expect(result).toBeNull();
    });
  });

  describe('getById', () => {
    it('should call prisma findUnique with id', async () => {
      await service.getById(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should return a user by id', async () => {
      prismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.getById(userId);

      expect(result).toEqual(user);
    });

    it('should return null if user not found by id', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.getById(userId);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    let dto: CreateUserDto;
    let hashedPassword: string;

    beforeEach(() => {
      dto = {
        email: user.email,
        password: user.password,
      };

      hashedPassword = 'hashedPassword';
    });

    it('should call hash with password from dto', async () => {
      await service.create(dto);

      expect(argon2.hash).toHaveBeenCalledWith(dto.password);
    });

    it('should call prisma create with correct data', async () => {
      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await service.create(dto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { ...dto, password: hashedPassword },
      });
    });

    it('should create a user with a hashed password', async () => {
      prismaService.user.create.mockResolvedValue(user);

      const result = await service.create(dto);

      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    let dto: UpdateUserDto;
    let hashedPassword: string;

    beforeEach(() => {
      dto = {
        email: user.email,
        password: user.password,
        name: user.name,
      };

      hashedPassword = 'hashedPassword';
    });

    it('should call hash with password from dto', async () => {
      await service.update(userId, dto);

      expect(argon2.hash).toHaveBeenCalledWith(dto.password);
    });

    it('should call prisma update with correct data', async () => {
      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await service.update(userId, dto);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { ...dto, password: hashedPassword },
      });
    });

    it('should update a user with a hashed password', async () => {
      prismaService.user.update.mockResolvedValue(user);

      const result = await service.update(userId, dto);

      expect(result).toEqual(user);
    });
  });
});
