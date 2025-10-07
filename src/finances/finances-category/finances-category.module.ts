import { Logger, Module } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { FinancesCategoryController } from './finances-category.controller';
import { FinancesCategoryRepository } from './finances-category.repository';
import { FinancesCategoryService } from './finances-category.service';

@Module({
  controllers: [FinancesCategoryController],
  providers: [
    FinancesCategoryService,
    FinancesCategoryRepository,
    PrismaService,
    Logger,
  ],
})
export class FinancesCategoryModule {}
