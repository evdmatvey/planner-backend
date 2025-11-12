import { ApiProperty } from '@nestjs/swagger';
import { MessageResponse } from '@/shared/swagger-types/message-response';
import { UserDtoDescriptionConstants } from './constants';

export class UserResponse {
  @ApiProperty({ example: 'cm5m0v1tt0000iob8oiy0txly' })
  id: string;

  @ApiProperty({
    example: 'test@test.test',
    description: UserDtoDescriptionConstants.EMAIL,
  })
  email: string;

  @ApiProperty({
    example: null,
    nullable: true,
    description: UserDtoDescriptionConstants.NAME,
  })
  name: string;

  @ApiProperty({
    example: '2025-01-07T05:20:26.369Z',
    description: UserDtoDescriptionConstants.CREATED_AT,
  })
  createdAt: string;

  @ApiProperty({ example: '2025-01-07T05:20:26.369Z' })
  updatedAt: string;
}

export class UpdateUserOkResponse extends MessageResponse {
  @ApiProperty({ type: UserResponse })
  user: UserResponse;
}
