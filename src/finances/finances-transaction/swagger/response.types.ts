import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  FinancesTransaction,
  FinancesTransactionType,
} from '@prisma/__generated__';
import { PagedResponseDto } from '@/shared/swagger';
import { TransactionDtoDescriptionConstants } from '../swagger';
import { FinancesTransactionEntity } from '../types/finances-transaction-entity.types';

export class FinancesTransactionResponse implements FinancesTransactionEntity {
  @ApiProperty({
    example: 'cm9seqlh70003iom8fjs9asoy',
  })
  id: string;

  @ApiProperty({
    example: 1413.23,
    description: TransactionDtoDescriptionConstants.VALUE,
  })
  value: number;

  @ApiProperty({
    example: FinancesTransactionType.INCOME,
    description: TransactionDtoDescriptionConstants.TYPE,
  })
  type: FinancesTransactionType;

  @ApiProperty({
    example: 'Пятёрочка',
    description: TransactionDtoDescriptionConstants.LABEL,
    required: true,
  })
  label: string;

  @ApiProperty({
    example: {
      id: 'cm9seqlh70003iom8fjs9asoy',
      title: 'Продукты',
    },
    description: TransactionDtoDescriptionConstants.CATEGORY,
    required: true,
  })
  financesCategory: { id: string; title: string };

  @ApiProperty({
    example: '2025-01-07T05:20:26.369Z',
    description: TransactionDtoDescriptionConstants.CREATED_AT,
    required: true,
  })
  createdAt: Date;
}

@ApiExtraModels(FinancesTransactionResponse)
export class PagedFinancesTransactionResponse extends PagedResponseDto<FinancesTransactionResponse> {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(FinancesTransactionResponse) },
  })
  data: FinancesTransactionResponse[];
}

export class CreateTransactionOkResponse {
  @ApiProperty({ type: FinancesTransactionResponse, required: true })
  transaction: FinancesTransaction;

  @ApiProperty()
  message: string;
}

export class UpdateTransactionOkResponse {
  @ApiProperty({ type: FinancesTransactionResponse, required: true })
  transaction: FinancesTransaction;

  @ApiProperty()
  message: string;
}

export class FinancesCategoryResponse {
  @ApiProperty({
    example: '430fjf42jid23D4i23j09eudajshadJJKK',
  })
  id: string;

  @ApiProperty({
    example: 'Продукты',
  })
  title: string;
}
