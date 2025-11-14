import { ApiProperty } from '@nestjs/swagger';
import { Color } from '@prisma/__generated__';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TagValidationConstants } from '../constants/tag-validation.constants';
import { TagDtoDescriptionConstants } from '../swagger';

export class CreateTagDto {
  @ApiProperty({
    example: 'Работа',
    description: TagDtoDescriptionConstants.TITLE,
    required: true,
  })
  @IsString({ message: TagValidationConstants.IS_STRING_TITLE })
  @IsNotEmpty({ message: TagValidationConstants.EMPTY_TITLE })
  title: string;

  @ApiProperty({ example: Color.ACCENT })
  @IsOptional()
  @IsEnum(Color, { message: TagValidationConstants.INCORRECT_COLOR })
  @IsString({ message: TagValidationConstants.IS_STRING_COLOR })
  @IsNotEmpty({ message: TagValidationConstants.EMPTY_COLOR })
  color?: Color;
}
