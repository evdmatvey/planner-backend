import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
  @ApiProperty({
    example: ['Ошибка валидации'],
    isArray: true,
    description:
      'Сообщение содержащие ошибку валидации. Например: "Укажите корректный email."',
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
    description: 'Статус ответа в текстовом виде',
  })
  error: string;

  @ApiProperty({
    example: 400,
    description: 'HTTP код статус ответа',
  })
  statusCode: number;
}

export const badRequestResponseDescription =
  'Ошибка валидации: переданы неверные данные';
