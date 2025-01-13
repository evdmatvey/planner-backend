import { ApiProperty } from '@nestjs/swagger';
import { Color } from '@prisma/__generated__';
import { MessageResponse } from '@/shared/swagger-types/message-response';

export class TagResponse {
  @ApiProperty({ example: 'cm5m1umec0000iojgjw5xh4nm' })
  id: string;

  @ApiProperty({ example: Color.ACCENT })
  color: Color;
}

export class TagOkResponse {
  @ApiProperty({ type: TagResponse })
  tag: TagOkResponse;
}

export class TagsOkResponse {
  @ApiProperty({ type: TagResponse, isArray: true })
  tags: TagResponse[];
}

export class TagWithMessageResponse extends MessageResponse {
  @ApiProperty({ type: TagResponse })
  tag: TagOkResponse;
}
