import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/__generated__';
import { UserMessageConstants } from './constants/user-message.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userId: string;
  let user: Omit<User, 'password'>;

  const mockUserService = {
    update: jest.fn(),
    getById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);

    userId = 'userId';
    user = {
      id: userId,
      email: 'test@email.test',
      name: 'name',
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  });

  describe('getProfile', () => {
    it('should return user profile by id', async () => {
      mockUserService.getById.mockResolvedValue(user);

      const result = await userController.getProfile(userId);

      expect(result).toEqual(user);
    });

    it('should return null if user profile not found', async () => {
      mockUserService.getById.mockResolvedValue(null);

      const result = await userController.getProfile(userId);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    let dto: UpdateUserDto;

    beforeEach(() => {
      dto = {
        name: user.name,
        password: 'password',
        email: user.email,
      };

      mockUserService.update.mockResolvedValue({ ...user, ...dto });
    });

    it('should call userService update method', async () => {
      await userController.update(userId, dto);

      expect(mockUserService.update).toHaveBeenCalledWith(userId, dto);
    });

    it('should successfully update a user and return the updated user and message', async () => {
      const result = await userController.update(userId, dto);

      expect(result).toEqual({
        user: user,
        message: UserMessageConstants.SUCCESS_UPDATE,
      });
    });
  });
});
