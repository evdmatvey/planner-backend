import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { mockPrismaService } from '@/shared/mocks/prisma-service.mock';
import { PrismaService } from '@/shared/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

jest.mock('argon2');

describe('UserService', () => {
  let service: UserService;
  let prismaService: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<typeof mockPrismaService>(PrismaService);
  });

  it('Should return a user by email', async () => {
    const email = 'test@example.com';
    const user = { id: '1', email };

    prismaService.user.findUnique.mockResolvedValue(user);

    const result = await service.getByEmail(email);

    expect(result).toEqual(user);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email },
    });
  });

  it('Should return null if user not found by email', async () => {
    const email = 'notfound@example.com';

    prismaService.user.findUnique.mockResolvedValue(null);

    const result = await service.getByEmail(email);

    expect(result).toBeNull();
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email },
    });
  });

  it('Should return a user by id', async () => {
    const id = '1';
    const user = { id, email: 'test@example.com' };

    prismaService.user.findUnique.mockResolvedValue(user);

    const result = await service.getById(id);

    expect(result).toEqual(user);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('Should return null if user not found by id', async () => {
    const id = 'nonexistent-id';

    prismaService.user.findUnique.mockResolvedValue(null);

    const result = await service.getById(id);

    expect(result).toBeNull();
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('Should create a user with a hashed password', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const hashedPassword = 'hashedPassword';
    (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const createdUser = {
      id: '1',
      ...dto,
      password: hashedPassword,
    };

    prismaService.user.create = jest.fn().mockResolvedValue(createdUser);

    const result = await service.create(dto);

    expect(result).toEqual(createdUser);
    expect(argon2.hash).toHaveBeenCalledWith(dto.password);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: { ...dto, password: hashedPassword },
    });
  });
});
