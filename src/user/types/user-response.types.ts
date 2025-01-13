import { ApiProperty } from '@nestjs/swagger';
import { MessageResponse } from '@/shared/swagger-types/message-response';

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

export class UpdateUserOkResponse extends MessageResponse {
  @ApiProperty({ type: UserResponse })
  user: UserResponse;
}
