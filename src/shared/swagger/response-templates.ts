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

export class MessageResponse {
  @ApiProperty({
    example: 'Сообщение связанное с результатом запроса.',
    description:
      'Сообщение связанное с результатом запроса. Например: "Настройки профиля успешно обновлены."',
  })
  message: string;
}

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

export class PagedResponseDto<T> {
  @ApiProperty({ isArray: true, description: 'Массив записей' })
  data: T[];

  @ApiProperty({
    example: 1,
    description: 'Номер текущей страницы',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Количество записей на странице',
  })
  pageSize: number;

  @ApiProperty({ example: 100, description: 'Общее количество записей' })
  totalCount: number;

  @ApiProperty({
    example: 10,
    description: 'Общее количество страниц',
  })
  totalPages: number;
}
