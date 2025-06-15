import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FinancesCategoryRepository } from '../finances-category.repository';
import { FinancesCategoryService } from '../finances-category.service';

// Mock DTOs
class CreateFinancesCategoryDto {}
class UpdateFinancesCategoryDto {}

describe('FinancesCategoryService', () => {
  let service: FinancesCategoryService;
  let repository: FinancesCategoryRepository;

  const mockCategory = (userId: string) => ({
    id: '1',
    userId,
    name: 'Test Category',
  });

  const mockRepository = {
    create: jest.fn((userId: string, dto: CreateFinancesCategoryDto) => {
      return Promise.resolve({ id: '1', userId, ...dto });
    }),
    getAll: jest.fn((userId: string) => {
      return Promise.resolve([{ id: '1', userId, name: 'Category 1' }]);
    }),
    getById: jest.fn((categoryId: string, userId: string) => {
      if (categoryId === '1') {
        return Promise.resolve(mockCategory(userId));
      }
      return Promise.resolve(null);
    }),
    update: jest.fn(
      (categoryId: string, userId: string, dto: UpdateFinancesCategoryDto) => {
        return Promise.resolve({ id: categoryId, ...dto });
      },
    ),
    delete: jest.fn((categoryId: string, userId: string) => {
      if (categoryId === '1') {
        return Promise.resolve(mockCategory(userId));
      }
      return Promise.resolve(null);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancesCategoryService,
        { provide: FinancesCategoryRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<FinancesCategoryService>(FinancesCategoryService);
    repository = module.get<FinancesCategoryRepository>(
      FinancesCategoryRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto = { title: 'title' };
      const userId = '1';
      const result = await service.create(userId, dto);
      expect(repository.create).toHaveBeenCalledWith(userId, dto);
      expect(result).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      const userId = '1';
      const result = await service.getAll(userId);
      expect(repository.getAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual([{ id: '1', userId, name: 'Category 1' }]);
    });
  });

  describe('getById', () => {
    it('should return category when it exists', async () => {
      const categoryId = '1';
      const userId = '1';
      const result = await service.getById(categoryId, userId);
      expect(repository.getById).toHaveBeenCalledWith(categoryId, userId);
      expect(result).toEqual(mockCategory(userId));
    });

    it('should throw NotFoundException when category does not exist', async () => {
      const categoryId = '2';
      const userId = '1';
      await expect(service.getById(categoryId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update category', async () => {
      const categoryId = '1';
      const userId = '1';
      const dto = { title: 'title' };
      const result = await service.update(categoryId, userId, dto);
      expect(repository.update).toHaveBeenCalledWith(categoryId, userId, dto);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when category does not exist', async () => {
      const categoryId = '2';
      const userId = '1';
      await expect(
        service.update(categoryId, userId, { title: 'title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete category when it exists', async () => {
      const categoryId = '1';
      const userId = '1';
      repository.delete = jest.fn((categoryId: string, userId: string) => {
        if (categoryId === '1' && userId === '1')
          return Promise.resolve({
            id: '1',
            title: 'Test Category',
            createdAt: new Date(),
          });
      });

      await service.delete(categoryId, userId);
      expect(repository.delete).toHaveBeenCalledWith(categoryId, userId);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      const categoryId = '2';
      const userId = '1';
      await expect(service.delete(categoryId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
