import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from '@/shared/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  public constructor(private readonly _prisma: PrismaService) {}

  public async getByEmail(email: string) {
    return this._prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  public async getById(id: string) {
    return this._prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  public async create(dto: CreateUserDto) {
    const data = {
      ...dto,
      password: await hash(dto.password),
    };

    return this._prisma.user.create({
      data,
    });
  }

  public async update(id: string, dto: UpdateUserDto) {
    let data = dto;

    if (data.password) {
      data = {
        ...dto,
        password: await hash(dto.password),
      };
    }

    return this._prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
