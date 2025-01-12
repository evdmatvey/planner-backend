import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/__generated__';
import { verify } from 'argon2';
import { UserService, removePasswordFromUser } from '@/user';
import { AuthMessageConstants } from '../constants/auth-message.constants';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResult } from '../types';

@Injectable()
export class AuthService {
  public constructor(private readonly _userService: UserService) {}

  public async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this._validateUser(dto);

    return removePasswordFromUser(user);
  }

  public async register(dto: RegisterDto): Promise<AuthResult> {
    const isUserExist = await this._userService.getByEmail(dto.email);

    if (isUserExist)
      throw new ConflictException(AuthMessageConstants.USER_ALREADY_EXIST);

    const { passwordRepeat, ...createUserDto } = dto;

    const user = await this._userService.create(createUserDto);

    return removePasswordFromUser(user);
  }

  public async getUserById(id: string): Promise<AuthResult> {
    const user = await this._userService.getById(id);

    if (!user) throw new NotFoundException(AuthMessageConstants.USER_NOT_FOUND);

    return removePasswordFromUser(user);
  }

  private async _validateUser(dto: LoginDto): Promise<User> {
    const user = await this._userService.getByEmail(dto.email);

    if (!user)
      throw new UnauthorizedException(
        AuthMessageConstants.INCORRECT_CREDENTIALS,
      );

    const isPasswordValid = await verify(user.password, dto.password);

    if (!isPasswordValid)
      throw new UnauthorizedException(
        AuthMessageConstants.INCORRECT_CREDENTIALS,
      );

    return user;
  }
}
