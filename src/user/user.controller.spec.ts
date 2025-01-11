import { Test, TestingModule } from '@nestjs/testing';
import { UserMessageConstants } from './constants/user-message.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {
    update: jest.fn(),
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
  });

  it('should successfully update a user and return the updated user and message', async () => {
    const userId = '123';
    const updateDto: UpdateUserDto = {
      name: 'John Doe',
      password: 'password',
      email: 'john@example.com',
    };
    const updatedUser = {
      id: userId,
      name: updateDto.name,
      email: updateDto.email,
    };

    mockUserService.update.mockResolvedValue(updatedUser);

    const result = await userController.update(userId, updateDto);

    expect(result).toEqual({
      user: updatedUser,
      message: UserMessageConstants.SUCCESS_UPDATE,
    });
    expect(mockUserService.update).toHaveBeenCalledWith(userId, updateDto);
  });
});
