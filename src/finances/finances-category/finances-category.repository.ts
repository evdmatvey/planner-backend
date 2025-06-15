import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { CreateFinancesCategoryDto } from './dto/create-finances-category.dto';
import { UpdateFinancesCategoryDto } from './dto/update-finances-category.dto';

@Injectable()
export class FinancesCategoryRepository {
  public constructor(private readonly _prisma: PrismaService) {}

  public async create(userId: string, dto: CreateFinancesCategoryDto) {
    return this._prisma.financesCategory.create({
      data: {
        userId,
        title: dto.title,
      },
      omit: {
        userId: true,
        updatedAt: true,
      },
    });
  }

  public async getAll(userId: string) {
    return this._prisma.financesCategory.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      omit: {
        userId: true,
        updatedAt: true,
      },
    });
  }

  public async getById(categoryId: string, userId: string) {
    return this._prisma.financesCategory.findFirst({
      where: {
        id: categoryId,
        userId,
      },
      omit: {
        userId: true,
        updatedAt: true,
      },
    });
  }

  public async update(
    categoryId: string,
    userId: string,
    dto: UpdateFinancesCategoryDto,
  ) {
    return this._prisma.financesCategory.update({
      where: {
        id: categoryId,
        userId,
      },
      data: {
        title: dto.title,
      },
      omit: {
        userId: true,
        updatedAt: true,
      },
    });
  }

  public async delete(categoryId: string, userId: string) {
    return this._prisma.financesCategory.delete({
      where: {
        id: categoryId,
        userId,
      },
      omit: {
        userId: true,
        updatedAt: true,
      },
    });
  }
}
