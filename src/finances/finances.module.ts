import { Module } from '@nestjs/common';
import { FinancesCategoryModule } from './finances-category/finances-category.module';
import { FinancesTransactionModule } from './finances-transaction/finances-transaction.module';

@Module({
  imports: [FinancesTransactionModule, FinancesCategoryModule],
  exports: [FinancesTransactionModule, FinancesCategoryModule],
})
export class FinancesModule {}
