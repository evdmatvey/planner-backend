import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty({
    example: 'Сообщение связанное с результатом запроса.',
    description:
      'Сообщение связанное с результатом запроса. Например: "Настройки профиля успешно обновлены."',
  })
  message: string;
}
