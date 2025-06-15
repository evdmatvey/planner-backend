import { Injectable, NotFoundException } from '@nestjs/common';
import { FinancesTransactionType } from '@prisma/__generated__';
import * as dayjs from 'dayjs';
import { Statistics } from '@/shared/lib/statistics';
import { PagedRequest } from '@/shared/types/paged-request.type';
import { CreateFinanceTransactionDto } from './dto/create-finances-transaction.dto';
import { UpdateFinanceTransactionDto } from './dto/update-finance-transaction.dto';
import { FinancesTransactionRepository } from './finances-transaction.repository';
import { toFixed } from './lib/to-fixed';
import { FinancesTransactionFilterParams } from './types/finances-transaction-filter.types';

@Injectable()
export class FinancesTransactionService {
  public constructor(
    private readonly _transactionRepository: FinancesTransactionRepository,
  ) {}

  public async create(userId: string, dto: CreateFinanceTransactionDto) {
    return this._transactionRepository.create(userId, dto);
  }

  public async getAllByFiltersPaged(
    pagedRequest: PagedRequest,
    filters: FinancesTransactionFilterParams,
  ) {
    return this._transactionRepository.getAllPaged(pagedRequest, filters);
  }

  public async update(
    userId: string,
    financesTransactionId: string,
    dto: UpdateFinanceTransactionDto,
  ) {
    await this._getTransactionOrThrow(userId, financesTransactionId);

    return this._transactionRepository.update(
      userId,
      financesTransactionId,
      dto,
    );
  }

  public async delete(userId: string, financesTransactionId: string) {
    await this._getTransactionOrThrow(userId, financesTransactionId);

    const deletedTransaction = await this._transactionRepository.delete(
      userId,
      financesTransactionId,
    );

    return deletedTransaction;
  }

  public async getOneWithMeanAndDeviation(
    userId: string,
    financesTransactionId: string,
  ) {
    const transaction = await this._getTransactionOrThrow(
      userId,
      financesTransactionId,
    );
    const { type, financesCategory, value } = transaction;
    const categoryId = financesCategory ? financesCategory.id : '';

    const allTimeStatsBySameType =
      await this._getTransactionsMeanAndDeviationPercentByFilters(
        this._buildAllTimeSameTypeFilters(userId, type),
        value,
      );

    const monthlyStatsBySameType =
      await this._getTransactionsMeanAndDeviationPercentByFilters(
        this._buildMonthlySameTypeFilters(userId, type),
        value,
      );

    const allTimeStatsBySameCategory = financesCategory
      ? await this._getTransactionsMeanAndDeviationPercentByFilters(
          this._buildAllTimeSameCategoryFilters(userId, categoryId),
          value,
        )
      : null;

    const monthlyStatsBySameCategory = financesCategory
      ? await this._getTransactionsMeanAndDeviationPercentByFilters(
          this._buildMonthlySameCategoryFilters(userId, categoryId),
          value,
        )
      : null;

    return {
      transaction,
      averageValues: {
        allTime: {
          sameType: allTimeStatsBySameType,
          sameCategory: allTimeStatsBySameCategory,
        },
        month: {
          bySameType: monthlyStatsBySameType,
          sameCategory: monthlyStatsBySameCategory,
        },
      },
    };
  }

  private async _getTransactionOrThrow(
    userId: string,
    financesTransactionId: string,
  ) {
    const transaction = await this._transactionRepository.getById(
      financesTransactionId,
      { userId },
    );

    if (transaction === null)
      throw new NotFoundException('Транзакция не найдена!');

    return transaction;
  }

  private _buildAllTimeSameTypeFilters(
    userId: string,
    transactionType: FinancesTransactionType,
  ): FinancesTransactionFilterParams {
    return { userId, type: transactionType };
  }

  private _buildAllTimeSameCategoryFilters(
    userId: string,
    categoryId: string,
  ): FinancesTransactionFilterParams {
    return { userId, categoryId };
  }

  private _buildMonthlySameTypeFilters(
    userId: string,
    transactionType: FinancesTransactionType,
  ): FinancesTransactionFilterParams {
    return {
      userId,
      period: {
        startDate: dayjs().startOf('M').toISOString(),
        endDate: dayjs().endOf('M').toISOString(),
      },
      type: transactionType,
    };
  }

  private _buildMonthlySameCategoryFilters(
    userId: string,
    categoryId: string,
  ): FinancesTransactionFilterParams {
    return {
      userId,
      period: {
        startDate: dayjs().startOf('M').toISOString(),
        endDate: dayjs().endOf('M').toISOString(),
      },
      categoryId,
    };
  }

  private async _getTransactionsMeanAndDeviationPercentByFilters(
    filters: FinancesTransactionFilterParams,
    value: number,
  ) {
    const filteredTransactions =
      await this._transactionRepository.getAll(filters);

    return this._getTransactionsMeanAndDeviationPercent(
      filteredTransactions,
      value,
    );
  }

  private _getTransactionsMeanAndDeviationPercent(
    transactions: { value: number }[],
    currentTransactionValue: number,
  ) {
    const transactionsStats = new Statistics(transactions, 'value');

    const mean = transactionsStats.getMean();
    const deviationPercent = transactionsStats.getDeviationPercent(
      currentTransactionValue,
    );

    return {
      mean: toFixed(mean, 2),
      deviationPercent: toFixed(deviationPercent, 2),
    };
  }
}
