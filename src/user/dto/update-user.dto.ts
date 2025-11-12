import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserValidationConstants } from '../constants/user-validation.constants';
import { UserDtoDescriptionConstants } from '../swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'name',
    description: UserDtoDescriptionConstants.NAME,
  })
  @IsNotEmpty({ message: UserValidationConstants.EMPTY_NAME })
  @IsString({ message: UserValidationConstants.IS_STRING_NAME })
  @MinLength(UserValidationConstants.MIN_NAME, {
    message: UserValidationConstants.MIN_LENGTH_NAME,
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    example: '123456',
    description: UserDtoDescriptionConstants.PASSWORD,
  })
  @IsNotEmpty({ message: UserValidationConstants.EMPTY_PASSWORD })
  @IsString({ message: UserValidationConstants.IS_STRING_PASSWORD })
  @MinLength(UserValidationConstants.MIN_PASSWORD, {
    message: UserValidationConstants.MIN_LENGTH_PASSWORD,
  })
  password?: string;

  @ApiProperty({
    example: 'test@test.test',
    description: UserDtoDescriptionConstants.EMAIL,
  })
  @IsNotEmpty({ message: UserValidationConstants.EMPTY_EMAIL })
  @IsString({ message: UserValidationConstants.IS_STRING_EMAIL })
  @IsEmail({}, { message: UserValidationConstants.INCORRECT_EMAIL })
  email: string;
}
