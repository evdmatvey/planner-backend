import { ApiProperty } from '@nestjs/swagger';
import { MessageResponse } from '@/shared/swagger-types/message-response';
import { AuthMessageConstants } from '../constants/auth-message.constants';

export class AuthUserResponse {
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

export class AuthOkResponse {
  @ApiProperty({ type: AuthUserResponse })
  user: AuthUserResponse;

  @ApiProperty({
    example: 'eyJhbGciOi.DEwfQ.9ExBwz6oXx_IYvSJOyVbET7Rs8wiDwVfssBEtuvIJWI',
  })
  accessToken: string;
}

export class AuthOkResponseWithMessage extends MessageResponse {
  @ApiProperty({ type: AuthUserResponse })
  user: AuthUserResponse;

  @ApiProperty({
    example: 'eyJhbGciOi.DEwfQ.9ExBwz6oXx_IYvSJOyVbET7Rs8wiDwVfssBEtuvIJWI',
  })
  accessToken: string;
}

export class AuthLoginUnauthorizedResponse {
  @ApiProperty({ example: AuthMessageConstants.INCORRECT_CREDENTIALS })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;

  @ApiProperty({ example: 401 })
  statusCode: number;
}

export class AuthUnauthorizedResponse {
  @ApiProperty({ example: AuthMessageConstants.NOT_FOUND_REFRESH_TOKEN })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;

  @ApiProperty({ example: 401 })
  statusCode: number;
}
