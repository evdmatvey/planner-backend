import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { TaskMessageConstants } from './constants/task-message.constants';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  public constructor(private readonly _prisma: PrismaService) {}

  public async getAll(userId: string) {
    return this._prisma.task.findMany({
      where: {
        userId,
      },
      include: {
        tags: true,
      },
    });
  }

  public async getById(userId: string, taskId: string) {
    return this._prisma.task.findUnique({
      where: {
        userId,
        id: taskId,
      },
      include: {
        tags: true,
      },
    });
  }

  public async create(userId: string, dto: CreateTaskDto) {
    return this._prisma.task.create({
      data: {
        ...dto,
        userId,
        tags: { connect: dto.tags },
      },
      include: {
        tags: true,
      },
    });
  }

  public async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    return this._prisma.task.update({
      where: {
        userId,
        id: taskId,
      },
      data: {
        ...dto,
        tags: {
          connect: dto.tags,
        },
      },
      include: {
        tags: true,
      },
    });
  }

  public async toggleTaskState(
    userId: string,
    taskId: string,
    state: 'isPinned' | 'isCompleted',
  ) {
    const task = await this.getById(userId, taskId);

    if (!task) throw new NotFoundException(TaskMessageConstants.TASK_NOT_FOUND);

    return this._prisma.task.update({
      where: {
        userId,
        id: taskId,
      },
      data: {
        [state]: !task[state],
      },
    });
  }

  public async delete(userId: string, taskId: string) {
    return this._prisma.task.delete({
      where: {
        userId,
        id: taskId,
      },
    });
  }
}
