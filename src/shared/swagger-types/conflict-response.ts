import { ApiProperty } from '@nestjs/swagger';

export class ConflictResponse {
  @ApiProperty({
    example: 'Такой пользователь уже есть в системе.',
    description:
      'Сообщает что ресурс который необходимо создать уже существует. Например: "Такой пользователь уже есть в системе."',
  })
  message: string;

  @ApiProperty({
    example: 'Conflict',
    description: 'Статус ответа в текстовом виде',
  })
  error: string;

  @ApiProperty({
    example: 409,
    description: 'HTTP код статус ответа',
  })
  statusCode: number;
}
