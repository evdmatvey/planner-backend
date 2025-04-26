import { FinancesTransactionType } from '@prisma/__generated__';

export interface FinancesTransactionFilterParams {
  userId: string;
  period?: {
    startDate: string;
    endDate: string;
  };
  categoryId?: string;
  type?: FinancesTransactionType;
}
