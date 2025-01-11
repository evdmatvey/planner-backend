import { ApiProperty } from '@nestjs/swagger';
import { UserMessageConstants } from '../constants/user-message.constants';
import { UserValidationConstants } from '../constants/user-validation.constants';

export class UserResponse {
  @ApiProperty({ example: 'cm5m0v1tt0000iob8oiy0txly' })
  id: string;

  @ApiProperty({ example: 'test@test.test' })
  email: string;

  @ApiProperty({ example: null, nullable: true })
  name: string;

  @ApiProperty({ example: '2025-01-07T05:20:26.369Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-01-07T05:20:26.369Z' })
  updatedAt: string;
}

export class UpdateUserOkResponse {
  @ApiProperty({ type: UserResponse })
  user: UserResponse;

  @ApiProperty({
    example: UserMessageConstants.SUCCESS_UPDATE,
  })
  message: string;
}

export class UnauthorizedResponse {
  @ApiProperty({ example: 'Unauthorized' })
  error: string;

  @ApiProperty({ example: 401 })
  statusCode: number;
}

export class UserBadRequestResponse {
  @ApiProperty({
    example: [UserValidationConstants.EMPTY_EMAIL],
    isArray: true,
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}
