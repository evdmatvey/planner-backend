import { Module } from '@nestjs/common';
import { FinancesTransactionModule } from './finances-transaction/finances-transaction.module';

@Module({
  imports: [FinancesTransactionModule],
  exports: [FinancesTransactionModule],
})
export class FinancesModule {}
