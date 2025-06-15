import { FinancesTransactionType } from '@prisma/__generated__';

export interface FinancesTransactionEntity {
  id: string;
  value: number;
  label: string | null;
  type: FinancesTransactionType;
  createdAt: Date;
  financesCategory: {
    id: string;
    title: string;
  };
}
