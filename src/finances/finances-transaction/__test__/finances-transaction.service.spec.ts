import { Test, TestingModule } from '@nestjs/testing';
import {
  FinancesTransaction,
  FinancesTransactionType,
} from '@prisma/__generated__';
import { CreateFinanceTransactionDto } from '../dto/create-finances-transaction.dto';
import { UpdateFinanceTransactionDto } from '../dto/update-finance-transaction.dto';
import { FinancesTransactionRepository } from '../finances-transaction.repository';
import { FinancesTransactionService } from '../finances-transaction.service';
import { FinancesTransactionEntity } from '../types/finances-transaction-entity.types';
import { FinancesTransactionFilterParams } from '../types/finances-transaction-filter.types';

const mockFinancesTransactionRepository = {
  getAll: jest.fn(),
  getAllPaged: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('FinancesTransactionService', () => {
  let service: FinancesTransactionService;
  let repository: typeof mockFinancesTransactionRepository;
  let userId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancesTransactionService,
        {
          provide: FinancesTransactionRepository,
          useValue: mockFinancesTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<FinancesTransactionService>(
      FinancesTransactionService,
    );
    repository = module.get<typeof mockFinancesTransactionRepository>(
      FinancesTransactionRepository,
    );

    userId = 'user-id';
  });

  describe('create', () => {
    it('should call repository.create', async () => {
      const transaction = createFinancesTransaction(
        'id',
        userId,
        'INCOME',
        100,
      );
      const dto: CreateFinanceTransactionDto = {
        type: transaction.type,
        value: transaction.value,
        label: transaction.label,
        financesCategoryId: transaction.financesCategoryId,
        createdAt: transaction.createdAt.toISOString(),
      };

      repository.create.mockResolvedValue(transaction);

      const created = await service.create(userId, dto);
      expect(repository.create).toHaveBeenCalledWith(userId, dto);
      expect(created).toEqual(transaction);
    });
  });

  describe('update', () => {
    it('should call repository.update', async () => {
      const transaction = createFinancesTransaction(
        'id',
        userId,
        'INCOME',
        100,
      );
      const dto: UpdateFinanceTransactionDto = {
        type: transaction.type,
        value: transaction.value,
        label: transaction.label,
        financesCategoryId: transaction.financesCategoryId,
        createdAt: transaction.createdAt.toISOString(),
      };

      repository.getById.mockResolvedValue(transaction);
      repository.update.mockResolvedValue(transaction);

      const updated = await service.update(userId, transaction.id, dto);
      expect(repository.update).toHaveBeenCalledWith(
        userId,
        transaction.id,
        dto,
      );
      expect(updated).toEqual(transaction);
    });

    it('should throw error if transaction not found', async () => {
      const transaction = createFinancesTransaction(
        'id',
        userId,
        'INCOME',
        100,
      );
      const dto: UpdateFinanceTransactionDto = {
        type: transaction.type,
        value: transaction.value,
        label: transaction.label,
        financesCategoryId: transaction.financesCategoryId,
        createdAt: transaction.createdAt.toISOString(),
      };

      repository.getById.mockResolvedValue(null);

      expect(service.update(userId, transaction.id, dto)).rejects.toThrow(
        'Транзакция не найдена!',
      );
    });
  });

  describe('delete', () => {
    it('should call repository.delete', async () => {
      const transaction = createFinancesTransaction(
        'id',
        userId,
        'INCOME',
        100,
      );
      repository.getById.mockResolvedValue(transaction);
      repository.delete.mockResolvedValue(transaction);

      const deleted = await service.delete(userId, transaction.id);
      expect(repository.delete).toHaveBeenCalledWith(userId, transaction.id);
      expect(deleted).toEqual(transaction);
    });

    it('should throw error if transaction not found', async () => {
      const transaction = createFinancesTransaction(
        'id',
        userId,
        'INCOME',
        100,
      );

      repository.getById.mockResolvedValue(null);

      expect(service.delete(userId, transaction.id)).rejects.toThrow(
        'Транзакция не найдена!',
      );
    });
  });

  describe('getAllByFilters', () => {
    it('should call repository.delete', async () => {
      const transaction = createFinancesTransaction(
        'id',
        userId,
        'INCOME',
        100,
      );
      repository.getById.mockResolvedValue(transaction);
      repository.delete.mockResolvedValue(transaction);

      const deleted = await service.delete(userId, transaction.id);
      expect(repository.delete).toHaveBeenCalledWith(userId, transaction.id);
      expect(deleted).toEqual(transaction);
    });

    it('should throw error if transaction not found', async () => {
      const transaction = createFinancesTransaction(
        'id',
        userId,
        'INCOME',
        100,
      );

      repository.getById.mockResolvedValue(null);

      expect(service.delete(userId, transaction.id)).rejects.toThrow(
        'Транзакция не найдена!',
      );
    });
  });

  describe('getAllByFiltersPaged', () => {
    it('should call repository.getAllPaged with correct params and return result', async () => {
      const pagedRequest = { page: 1, pageSize: 10 };
      const filters: FinancesTransactionFilterParams = { userId };

      const pagedResponse = {
        data: [createFinancesTransaction('id1', userId, 'INCOME', 100)],
        page: 1,
        pageSize: 10,
        totalCount: 1,
      };

      repository.getAllPaged.mockResolvedValue(pagedResponse);

      const result = await service.getAllByFiltersPaged(pagedRequest, filters);

      expect(repository.getAllPaged).toHaveBeenCalledWith(
        pagedRequest,
        filters,
      );
      expect(result).toEqual(pagedResponse);
    });
  });

  describe('getOneWithMeanAndDeviation', () => {
    it('should return transaction with calculated stats', async () => {
      const transaction = createFinancesTransactionEntity(
        'id',
        userId,
        'INCOME',
        100,
        { id: 'category-id', title: 'Category' },
      );

      repository.getById.mockResolvedValue(transaction);

      const sameTypeTransactions = [
        { value: 80 },
        { value: 120 },
        { value: 100 },
      ];
      const sameCategoryTransactions = [{ value: 90 }, { value: 110 }];

      repository.getAll.mockImplementation(async (filters) => {
        if (filters.type) return sameTypeTransactions;
        if (filters.categoryId) return sameCategoryTransactions;
        return [];
      });

      const result = await service.getOneWithMeanAndDeviation(
        userId,
        transaction.id,
      );

      expect(repository.getById).toHaveBeenCalledWith(transaction.id, {
        userId,
      });

      expect(repository.getAll).toHaveBeenCalledTimes(4);

      expect(result.transaction).toEqual(transaction);

      expect(result.averageValues.allTime.sameType).toHaveProperty('mean');
      expect(result.averageValues.allTime.sameType).toHaveProperty(
        'deviationPercent',
      );
      expect(result.averageValues.month.bySameType).toHaveProperty('mean');
      expect(result.averageValues.month.bySameType).toHaveProperty(
        'deviationPercent',
      );
      expect(result.averageValues.allTime.sameCategory).toHaveProperty('mean');
      expect(result.averageValues.allTime.sameCategory).toHaveProperty(
        'deviationPercent',
      );
      expect(result.averageValues.month.sameCategory).toHaveProperty('mean');
      expect(result.averageValues.month.sameCategory).toHaveProperty(
        'deviationPercent',
      );
    });

    it('should throw NotFoundException if transaction not found', async () => {
      repository.getById.mockResolvedValue(null);

      await expect(
        service.getOneWithMeanAndDeviation(userId, 'non-existent-id'),
      ).rejects.toThrow('Транзакция не найдена!');
    });
  });
});

function createFinancesTransaction(
  id: string,
  userId: string,
  type: FinancesTransactionType,
  value: number,
): FinancesTransaction {
  return {
    id,
    userId,
    type,
    value,
    label: 'test',
    financesCategoryId: 'category-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createFinancesTransactionEntity(
  id: string,
  userId: string,
  type: FinancesTransactionType,
  value: number,
  category: {
    id: string;
    title: string;
  },
): FinancesTransactionEntity {
  return {
    id,
    type,
    value,
    label: 'test',
    financesCategory: category,
    createdAt: new Date(),
  };
}
