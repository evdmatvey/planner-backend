import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponse {
  @ApiProperty({
    example: 'Пользователь не найден',
    description:
      'Сообщает что запрашиваемый ресурс не был найден. Например: "Пользователь не найден."',
  })
  message: string;

  @ApiProperty({
    example: 'Not Found',
    description: 'Статус ответа в текстовом виде',
  })
  error: string;

  @ApiProperty({
    example: 404,
    description: 'HTTP код статус ответа',
  })
  statusCode: number;
}
