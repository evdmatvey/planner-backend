import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponse {
  @ApiProperty({
    example: 'Unauthorized',
    description: 'Статус ответа в текстовом виде',
  })
  error: string;

  @ApiProperty({
    example: 401,
    description: 'HTTP код статус ответа',
  })
  statusCode: number;
}

export const unauthorizedResponseDescription =
  'Нет доступа: требуется авторизация';
