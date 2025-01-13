import { Test, TestingModule } from '@nestjs/testing';
import { Priority, Task } from '@prisma/__generated__';
import { mockPrismaService } from '@/shared/mocks/prisma-service.mock';
import { PrismaService } from '@/shared/services/prisma.service';
import { TaskMessageConstants } from './constants/task-message.constants';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: typeof mockPrismaService;
  let userId: string;
  let taskId: string;
  let task: Task;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<typeof mockPrismaService>(PrismaService);
    userId = 'user-id';
    taskId = 'task-id';
    task = {
      id: taskId,
      title: 'title',
      description: 'description',
      executionTime: 60,
      isCompleted: false,
      priority: Priority.LOW,
      userId,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  });

  describe('getAll', () => {
    it('should call prisma findMany with userId', async () => {
      await service.getAll(userId);

      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: {
          tags: true,
        },
      });
    });

    it('should return a tasks by userId', async () => {
      prismaService.task.findMany.mockResolvedValue([task]);

      const result = await service.getAll(userId);

      expect(result[0]).toEqual(task);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array if tasks not found by userId', async () => {
      prismaService.task.findMany.mockResolvedValue([]);

      const result = await service.getAll(userId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('getById', () => {
    it('should call prisma findUnique with userId and taskId', async () => {
      await service.getById(userId, taskId);

      expect(prismaService.task.findUnique).toHaveBeenCalledWith({
        where: { userId, id: taskId },
        include: {
          tags: true,
        },
      });
    });

    it('should return a task by userId and taskId', async () => {
      prismaService.task.findUnique.mockResolvedValue(task);

      const result = await service.getById(userId, taskId);

      expect(result).toEqual(task);
    });

    it('should return null if task not found by userId and taskId', async () => {
      prismaService.task.findUnique.mockResolvedValue(null);

      const result = await service.getById(userId, taskId);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    let dto: CreateTaskDto;

    beforeEach(() => {
      dto = {
        title: task.title,
        description: task.description,
        executionTime: task.executionTime,
        priority: task.priority,
        tags: [],
      };
    });

    it('should call prisma create with correct data', async () => {
      await service.create(userId, dto);

      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          userId,
          tags: { connect: dto.tags },
        },
        include: {
          tags: true,
        },
      });
    });

    it('should create a user with a hashed password', async () => {
      prismaService.task.create.mockResolvedValue(task);

      const result = await service.create(userId, dto);

      expect(result).toEqual(task);
    });
  });

  describe('update', () => {
    let dto: UpdateTaskDto;

    beforeEach(() => {
      dto = {
        title: 'new title',
        description: task.description,
        executionTime: task.executionTime,
        priority: task.priority,
        tags: [],
      };
    });

    it('should call prisma update with correct data', async () => {
      await service.update(userId, taskId, dto);

      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: {
          userId,
          id: taskId,
        },
        data: {
          ...dto,
          tags: { connect: dto.tags },
        },
        include: {
          tags: true,
        },
      });
    });

    it('should update task', async () => {
      prismaService.task.update.mockResolvedValue({ ...task, ...dto });

      const result = await service.update(userId, taskId, dto);

      expect(result).toEqual({ ...task, ...dto });
    });
  });

  describe('toggleIsCompleted', () => {
    it('should toggle isCompleted to true', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockPrismaService.task.update.mockResolvedValue({
        ...task,
        isCompleted: !task.isCompleted,
      });

      const result = await service.toggleIsCompleted(userId, taskId);

      expect(result.isCompleted).toBe(true);
    });

    it('should throw error if task not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      expect(service.toggleIsCompleted(userId, taskId)).rejects.toThrow(
        TaskMessageConstants.TASK_NOT_FOUND,
      );
    });
  });

  describe('delete', () => {
    it('should call prisma delete with correct data', async () => {
      await service.delete(userId, taskId);

      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: {
          userId,
          id: taskId,
        },
      });
    });

    it('should delete task', async () => {
      prismaService.task.delete.mockResolvedValue(task);

      const result = await service.delete(userId, taskId);

      expect(result).toEqual(task);
    });
  });
});
