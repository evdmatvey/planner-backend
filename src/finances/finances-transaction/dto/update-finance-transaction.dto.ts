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
import { TransactionDtoDescriptionConstants } from '../swagger';
import { FinancesTransactionValidationConstants } from './constants/validation';

export class UpdateFinanceTransactionDto {
  @ApiProperty({
    example: 1413.23,
    description: TransactionDtoDescriptionConstants.VALUE,
    required: false,
  })
  @IsNumber(
    {},
    { message: FinancesTransactionValidationConstants.IS_NUMBER_VALUE },
  )
  @Min(0.0000001, {
    message: FinancesTransactionValidationConstants.MIN_VALUE,
  })
  @Max(15000000, { message: FinancesTransactionValidationConstants.MAX_VALUE })
  @IsOptional()
  value?: number;

  @ApiProperty({
    example: FinancesTransactionType.INCOME,
    description: TransactionDtoDescriptionConstants.TYPE,
    required: false,
  })
  @IsEnum(FinancesTransactionType, {
    message: FinancesTransactionValidationConstants.INCORRECT_TYPE,
  })
  @IsOptional()
  type?: FinancesTransactionType;

  @ApiProperty({
    example: 'Пятёрочка',
    description: TransactionDtoDescriptionConstants.LABEL,
    required: false,
  })
  @ValidateIf((o) => o.label !== null && o.label !== undefined)
  @IsString({
    message: FinancesTransactionValidationConstants.IS_STRING_LABEL,
  })
  @Length(3, 50, {
    message: FinancesTransactionValidationConstants.LENGTH_LABEL,
  })
  label?: string | null;

  @ApiProperty({
    example: '430fjf42jid23D4i23j09eudajshadJJKK',
    description: TransactionDtoDescriptionConstants.CATEGORY_ID,
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
    description: TransactionDtoDescriptionConstants.CREATED_AT,
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: FinancesTransactionValidationConstants.INCORRECT_CREATED_AT },
  )
  createdAt?: string;
}
