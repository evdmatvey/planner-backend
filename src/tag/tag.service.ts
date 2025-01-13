import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  public constructor(private readonly _prisma: PrismaService) {}

  public async getAll(userId: string) {
    return this._prisma.tag.findMany({
      where: {
        userId,
      },
    });
  }

  public async getById(userId: string, tagId: string) {
    return this._prisma.tag.findUnique({
      where: {
        userId,
        id: tagId,
      },
    });
  }

  public async create(userId: string, dto: CreateTagDto) {
    return this._prisma.tag.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  public async update(userId: string, tagId: string, dto: UpdateTagDto) {
    return this._prisma.tag.update({
      where: {
        userId,
        id: tagId,
      },
      data: dto,
    });
  }

  public async delete(userId: string, tagId: string) {
    return this._prisma.tag.delete({
      where: {
        userId,
        id: tagId,
      },
    });
  }
}
