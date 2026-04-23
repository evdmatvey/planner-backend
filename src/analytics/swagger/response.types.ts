import { ApiProperty } from '@nestjs/swagger';
import { Color } from '@prisma/__generated__';

class GroupAnalyticsResponse {
  @ApiProperty({ example: 1 })
  count: number;

  @ApiProperty({ example: 60 })
  executionTime: number;
}

class GroupsAnalyticsResponse {
  @ApiProperty({ type: GroupAnalyticsResponse })
  all: GroupAnalyticsResponse;

  @ApiProperty({ type: GroupAnalyticsResponse })
  todo: GroupAnalyticsResponse;

  @ApiProperty({ type: GroupAnalyticsResponse })
  completed: GroupAnalyticsResponse;
}

export class TaskAnalyticsResponse {
  @ApiProperty({ example: '29.01.2025' })
  date: string;

  @ApiProperty({ type: GroupsAnalyticsResponse, isArray: true })
  tasks: GroupsAnalyticsResponse[];
}

export class TagAnalyticsResponse {
  @ApiProperty({ example: 'cm5un7f4i0005iow4oro9fcq3' })
  id: string;

  @ApiProperty({ example: 'Tag' })
  title: string;

  @ApiProperty({ example: 'RED', enum: Color })
  color: Color;

  @ApiProperty({ type: TaskAnalyticsResponse, isArray: true })
  tasks: TaskAnalyticsResponse[];
}
