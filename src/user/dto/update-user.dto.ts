import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserValidationConstants } from '../constants/user-validation.constants';

export class UpdateUserDto {
  @IsNotEmpty({ message: UserValidationConstants.EMPTY_NAME })
  @IsString({ message: UserValidationConstants.IS_STRING_NAME })
  @MinLength(UserValidationConstants.MIN_NAME, {
    message: UserValidationConstants.MIN_LENGTH_NAME,
  })
  name: string;

  @IsNotEmpty({ message: UserValidationConstants.EMPTY_PASSWORD })
  @IsString({ message: UserValidationConstants.IS_STRING_PASSWORD })
  @MinLength(UserValidationConstants.MIN_PASSWORD, {
    message: UserValidationConstants.MIN_LENGTH_PASSWORD,
  })
  password: string;

  @IsNotEmpty({ message: UserValidationConstants.EMPTY_EMAIL })
  @IsString({ message: UserValidationConstants.IS_STRING_EMAIL })
  @IsEmail({}, { message: UserValidationConstants.INCORRECT_EMAIL })
  email: string;
}
