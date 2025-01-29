import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { TagService } from '@/tag';
import { TaskService } from '@/task';

@Injectable()
export class AnalyticsService {
  public constructor(
    private readonly _prisma: PrismaService,
    private readonly _taskService: TaskService,
    private readonly _tagService: TagService,
  ) {}
}
