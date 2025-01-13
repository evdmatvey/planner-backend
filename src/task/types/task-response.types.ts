import { ApiProperty } from '@nestjs/swagger';
import { Color, Priority } from '@prisma/__generated__';
import { BadRequestResponse } from '@/shared/swagger-types/badrequest-response';
import { MessageResponse } from '@/shared/swagger-types/message-response';
import { TaskMessageConstants } from '../constants/task-message.constants';

export class TaskResponse {
  @ApiProperty({ example: 'cm5m0v1tt0000iob8oiy0txly' })
  id: string;

  @ApiProperty({ example: 'Задача 1' })
  title: string;

  @ApiProperty({ example: 'описание задачи 1' })
  description: string;

  @ApiProperty({ example: Priority.LOW, enum: Priority })
  priority: Priority;

  @ApiProperty({ example: 60 })
  executionTime: number;

  @ApiProperty({ example: false })
  isCompleted: false;

  @ApiProperty({ example: '2025-01-13T05:52:25.460Z' })
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

export class ToggleTaskStateBadRequestResponse extends BadRequestResponse {
  @ApiProperty({
    example: TaskMessageConstants.INCORRECT_TASK_STATE,
  })
  message: string[];
}
