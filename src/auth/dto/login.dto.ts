import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { AuthValidationConstants } from '../constants/auth-validation.constants';

export class LoginDto {
  @ApiProperty({ example: 'test@test.test' })
  @IsNotEmpty({ message: AuthValidationConstants.EMPTY_EMAIL })
  @IsString({ message: AuthValidationConstants.IS_STRING_EMAIL })
  @IsEmail({}, { message: AuthValidationConstants.IS_STRING_EMAIL })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: AuthValidationConstants.EMPTY_PASSWORD })
  @IsString({ message: AuthValidationConstants.IS_STRING_PASSWORD })
  @MinLength(6, { message: AuthValidationConstants.MIN_LENGTH_PASSWORD })
  password: string;
}
