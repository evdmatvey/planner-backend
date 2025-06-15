import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFinancesCategoryDto } from './dto/create-finances-category.dto';
import { UpdateFinancesCategoryDto } from './dto/update-finances-category.dto';
import { FinancesCategoryRepository } from './finances-category.repository';

@Injectable()
export class FinancesCategoryService {
  public constructor(
    private readonly _categoryRepository: FinancesCategoryRepository,
  ) {}

  public async create(userId: string, dto: CreateFinancesCategoryDto) {
    return this._categoryRepository.create(userId, dto);
  }

  public async getAll(userId: string) {
    return this._categoryRepository.getAll(userId);
  }

  public async getById(categoryId: string, userId: string) {
    const category = await this._getByIdOrThrow(categoryId, userId);

    return category;
  }

  public async update(
    categoryId: string,
    userId: string,
    dto: UpdateFinancesCategoryDto,
  ) {
    await this._getByIdOrThrow(categoryId, userId);

    return this._categoryRepository.update(categoryId, userId, dto);
  }

  public async delete(categoryId: string, userId: string) {
    await this._getByIdOrThrow(categoryId, userId);

    return this._categoryRepository.delete(categoryId, userId);
  }

  private async _getByIdOrThrow(categoryId: string, userId: string) {
    const category = await this._categoryRepository.getById(categoryId, userId);

    if (category === null) throw new NotFoundException('Категория не найдена!');

    return category;
  }
}
