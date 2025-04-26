import { ApiProperty } from '@nestjs/swagger';
import { FinancesTransactionType } from '@prisma/__generated__';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { FinancesTransactionDescriptionConstants } from '../constants/finances-transaction-description.constants';
import { FinancesTransactionValidationConstants } from '../constants/finances-transaction-validation.constants';

export class UpdateFinanceTransactionDto {
  @ApiProperty({
    example: 1413.23,
    description: FinancesTransactionDescriptionConstants.VALUE,
    required: false,
  })
  @IsNumber(
    {},
    { message: FinancesTransactionValidationConstants.IS_NUMBER_VALUE },
  )
  @Min(0.0000001, { message: FinancesTransactionValidationConstants.MIN_VALUE })
  @Max(15000000, { message: FinancesTransactionValidationConstants.MAX_VALUE })
  @IsOptional()
  value?: number;

  @ApiProperty({
    example: FinancesTransactionType.INCOME,
    description: FinancesTransactionDescriptionConstants.TYPE,
    required: false,
  })
  @IsEnum(FinancesTransactionType, {
    message: FinancesTransactionValidationConstants.INCORRECT_TYPE,
  })
  @IsOptional()
  type?: FinancesTransactionType;

  @ApiProperty({
    example: 'Пятёрочка',
    description: FinancesTransactionDescriptionConstants.LABEL,
    required: false,
  })
  @ValidateIf((o) => o.label !== null && o.label !== undefined)
  @IsString({ message: FinancesTransactionValidationConstants.IS_STRING_LABEL })
  @Length(3, 50, {
    message: FinancesTransactionValidationConstants.LENGTH_LABEL,
  })
  label?: string | null;

  @ApiProperty({
    example: '430fjf42jid23D4i23j09eudajshadJJKK',
    description: FinancesTransactionDescriptionConstants.CATEGORY_ID,
    required: false,
  })
  @ValidateIf((o) => o.categoryId !== null && o.categoryId !== undefined)
  @IsString({
    message: FinancesTransactionValidationConstants.IS_STRING_CATEGORY_ID,
  })
  @Matches(/^[a-z0-9]{25,}$/i, {
    message: FinancesTransactionValidationConstants.INCORRECT_CATEGORY_ID,
  })
  categoryId?: string | null;

  @ApiProperty({
    example: '2025-01-07T05:20:26.369Z',
    description: FinancesTransactionDescriptionConstants.CREATED_AT,
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: FinancesTransactionValidationConstants.INCORRECT_CREATED_AT },
  )
  createdAt?: string;
}
