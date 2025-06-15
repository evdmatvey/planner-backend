import { ApiProperty } from '@nestjs/swagger';
import { FinancesCategory } from '@prisma/__generated__';
import { FinancesCategoryDtoDescriptionConstants } from '../swagger';

export class FinancesCategoryResponse {
  @ApiProperty({
    example: 'cm9seqlh70003iom8fjs9asoy',
  })
  id: string;

  @ApiProperty({
    example: 'Работа',
    description: FinancesCategoryDtoDescriptionConstants.TITLE,
  })
  title: string;

  @ApiProperty({
    example: '2025-01-07T05:20:26.369Z',
    description: FinancesCategoryDtoDescriptionConstants.CREATED_AT,
    required: true,
  })
  createdAt: Date;
}

export class CreateFinancesCategoryOkResponse {
  @ApiProperty({ type: FinancesCategoryResponse, required: true })
  category: FinancesCategory;

  @ApiProperty()
  message: string;
}

export class FinancesCategoryOkResponse {
  @ApiProperty({ type: FinancesCategoryResponse, required: true })
  category: FinancesCategory;
}

export class GetAllCategoryOkResponse {
  @ApiProperty({
    type: FinancesCategoryResponse,
    required: true,
    isArray: true,
  })
  categories: FinancesCategory[];
}

export class UpdateFinancesCategoryOkResponse {
  @ApiProperty({ type: FinancesCategoryResponse, required: true })
  category: FinancesCategory;

  @ApiProperty()
  message: string;
}
