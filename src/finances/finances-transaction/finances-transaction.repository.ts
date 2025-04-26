import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/__generated__';
import { PrismaService } from '@/shared/services/prisma.service';
import { CreateFinanceTransactionDto } from './dto/create-finances-transaction.dto';
import { UpdateFinanceTransactionDto } from './dto/update-finance-transaction.dto';
import { FinancesTransactionFilterParams } from './types/finances-transaction-filter.types';

@Injectable()
export class FinancesTransactionRepository {
  public constructor(private readonly _prisma: PrismaService) {}

  public async getAll(filterParams: FinancesTransactionFilterParams) {
    const where = this._buildWhereFilter(filterParams);

    return this._prisma.financesTransaction.findMany({
      where,
      omit: {
        financesCategoryId: true,
        userId: true,
        updatedAt: true,
      },
      include: {
        financesCategory: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  public async getById(
    financesTransactionId: string,
    filterParams: FinancesTransactionFilterParams,
  ) {
    const where = this._buildWhereFilter(filterParams, {
      id: financesTransactionId,
    });

    return this._prisma.financesTransaction.findUnique({
      where: where as Prisma.FinancesTransactionWhereUniqueInput,
      omit: {
        financesCategoryId: true,
        userId: true,
        updatedAt: true,
      },
      include: {
        financesCategory: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  public async create(userId: string, dto: CreateFinanceTransactionDto) {
    return this._prisma.financesTransaction.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  public async update(
    userId: string,
    financesTransactionId: string,
    dto: UpdateFinanceTransactionDto,
  ) {
    return this._prisma.financesTransaction.update({
      where: {
        userId,
        id: financesTransactionId,
      },
      data: dto,
    });
  }

  public async delete(userId: string, financesTransactionId: string) {
    return this._prisma.financesTransaction.delete({
      where: {
        userId,
        id: financesTransactionId,
      },
    });
  }

  private _buildWhereFilter(
    filterParams: FinancesTransactionFilterParams,
    extraFilters?: Partial<Prisma.FinancesTransactionWhereInput>,
  ): Prisma.FinancesTransactionWhereInput {
    const { userId, period, categoryId, type } = filterParams;

    const createdAtFilter: Prisma.DateTimeFilter = {};
    if (period?.startDate) createdAtFilter.gte = period.startDate;
    if (period?.endDate) createdAtFilter.lte = period.endDate;

    return {
      userId,
      ...(Object.keys(createdAtFilter).length && {
        createdAt: createdAtFilter,
      }),
      ...(categoryId && { financesCategoryId: categoryId }),
      ...(type && { type }),
      ...extraFilters,
    };
  }
}
