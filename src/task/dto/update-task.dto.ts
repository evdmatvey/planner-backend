import { ApiProperty } from '@nestjs/swagger';
import { Priority } from '@prisma/__generated__';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskValidationConstants } from '../constants/task-validation.constants';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Задача 1' })
  @IsOptional()
  @IsString({ message: TaskValidationConstants.IS_STRING_TITLE })
  @IsNotEmpty({ message: TaskValidationConstants.EMPTY_TITLE })
  title?: string;

  @ApiProperty({ example: 'описание задачи 1' })
  @IsOptional()
  @IsNotEmpty({ message: TaskValidationConstants.EMPTY_DESCRIPTION })
  @IsString({ message: TaskValidationConstants.IS_STRING_DESCRIPTION })
  description?: string;

  @ApiProperty({ example: 60 })
  @IsOptional()
  @IsNotEmpty({ message: TaskValidationConstants.EMPTY_EXECUTION_TIME })
  @IsNumber({}, { message: TaskValidationConstants.IS_NUMBER_EXECUTION_TIME })
  executionTime?: number;

  @ApiProperty({ example: Priority.LOW })
  @IsOptional()
  @IsNotEmpty({ message: TaskValidationConstants.EMPTY_PRIORITY })
  @IsEnum(Priority, { message: TaskValidationConstants.INCORRECT_PRIORITY })
  priority?: Priority;

  @ApiProperty({
    example: [{ id: 'cm5m0v1tt0000iob8oiy0txly' }],
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: TaskValidationConstants.INCORRECT_TAGS })
  tags?: { id: string }[];

  @ApiProperty({ example: '2025-01-07T05:20:26.369Z' })
  @IsOptional()
  @IsDateString({}, { message: TaskValidationConstants.INCORRECT_CREATED_AT })
  createdAt?: string;

  @ApiProperty({ example: '2025-01-07T05:20:26.369Z' })
  @IsOptional()
  @IsBoolean({ message: TaskValidationConstants.INCORRECT_IS_COMPLETED })
  isCompleted?: boolean;
}
