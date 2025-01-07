import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { AuthValidationConstants } from '../constants/auth-validation.constants';
import { IsPasswordsMatchingConstraint } from '../decorators/is-password-matching-constraint.decorator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: AuthValidationConstants.EMPTY_PASSWORD_REPEAT })
  @IsString({ message: AuthValidationConstants.IS_STRING_PASSWORD_REPEAT })
  @MinLength(6, { message: AuthValidationConstants.MIN_LENGTH_PASSWORD_REPEAT })
  @Validate(IsPasswordsMatchingConstraint, {
    message: AuthValidationConstants.INCORRECT_PASSWORD_REPEAT,
  })
  passwordRepeat: string;
}
