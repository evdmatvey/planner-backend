import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

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
}
