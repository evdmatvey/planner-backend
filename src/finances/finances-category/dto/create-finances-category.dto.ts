import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { FinancesCategoryValidationConstants } from './constants/validation';

export class CreateFinancesCategoryDto {
  @ApiProperty({
    example: 'Работа',
    description: '',
  })
  @IsString({ message: FinancesCategoryValidationConstants.IS_STRING_TITLE })
  @Length(3, 30, {
    message: FinancesCategoryValidationConstants.LENGTH_TITLE,
  })
  title: string;
}
