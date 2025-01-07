import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AuthValidationConstants } from '../constants/auth-validation.constants';
import { RegisterDto } from '../dto/register.dto';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint
  implements ValidatorConstraintInterface
{
  public validate(passwordRepeat: string, args: ValidationArguments) {
    const obj = args.object as RegisterDto;
    return obj.password === passwordRepeat;
  }

  public defaultMessage() {
    return AuthValidationConstants.INCORRECT_PASSWORD_REPEAT;
  }
}
