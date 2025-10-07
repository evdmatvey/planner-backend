import { Logger, Module } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { FinancesTransactionController } from './finances-transaction.controller';
import { FinancesTransactionRepository } from './finances-transaction.repository';
import { FinancesTransactionService } from './finances-transaction.service';

@Module({
  controllers: [FinancesTransactionController],
  providers: [
    FinancesTransactionService,
    FinancesTransactionRepository,
    PrismaService,
    Logger,
  ],
})
export class FinancesTransactionModule {}
