import { ApiProperty } from '@nestjs/swagger';
import { Color, Priority } from '@prisma/__generated__';
import { MessageResponse } from '@/shared/swagger-types/message-response';
import { TaskDtoDescriptionConstants } from './constants';

export class TaskResponse {
  @ApiProperty({ example: 'cm5m0v1tt0000iob8oiy0txly' })
  id: string;

  @ApiProperty({
    example: 'Задача 1',
    description: TaskDtoDescriptionConstants.TITLE,
  })
  title: string;

  @ApiProperty({
    example: 'описание задачи 1',
    description: TaskDtoDescriptionConstants.DESCRIPTION,
  })
  description: string;

  @ApiProperty({
    example: Priority.LOW,
    enum: Priority,
    description: TaskDtoDescriptionConstants.PRIORITY,
  })
  priority: Priority;

  @ApiProperty({
    example: 60,
    description: TaskDtoDescriptionConstants.EXECUTION_TIME,
  })
  executionTime: number;

  @ApiProperty({
    example: false,
    description: TaskDtoDescriptionConstants.IS_COMPLETED,
  })
  isCompleted: false;

  @ApiProperty({
    example: '2025-01-13T05:52:25.460Z',
    description: TaskDtoDescriptionConstants.CREATED_AT,
  })
  createdAt: string;

  @ApiProperty({ example: '2025-01-13T05:52:25.460Z' })
  updatedAt: string;

  @ApiProperty({ example: 'cm5m1umec0000iojgjw5xh4nm' })
  userId: string;
}

export class TaskWithTagsResponse extends TaskResponse {
  @ApiProperty({
    example: [
      { id: 'cm5m1umec0000iojgjw5xh4nm', title: 'tag', color: Color.BLUE },
    ],
    isArray: true,
  })
  tags: [];
}

export class TaskWithTagsAndMessageResponse extends MessageResponse {
  @ApiProperty({ type: TaskWithTagsResponse })
  task: TaskWithTagsResponse;
}

export class TaskWithMessageResponse extends MessageResponse {
  @ApiProperty({ type: TaskResponse })
  task: TaskResponse;
}
