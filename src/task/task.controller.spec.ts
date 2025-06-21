import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Priority, Task } from '@prisma/__generated__';
import { TaskMessageConstants } from './constants/task-message.constants';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let taskController: TaskController;
  let mockTaskService;

  const userId = 'userId';
  const taskId = 'taskId';
  let task: Task;

  beforeEach(async () => {
    mockTaskService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      toggleIsCompleted: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
        Logger,
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    task = {
      id: taskId,
      title: 'Test Task',
      description: 'Test Description',
      isCompleted: false,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      executionTime: 50,
      priority: Priority.LOW,
      userId,
    };
  });

  describe('getAll', () => {
    it('should call getAll method of taskService', async () => {
      mockTaskService.getAll.mockResolvedValue([task]);

      await taskController.getAll(userId);

      expect(mockTaskService.getAll).toHaveBeenCalledWith(userId);
    });

    it('should return all tasks for a user', async () => {
      mockTaskService.getAll.mockResolvedValue([task]);

      const result = await taskController.getAll(userId);

      expect(result).toEqual({ tasks: [task] });
    });

    it('should return empty array if tasks not found', async () => {
      mockTaskService.getAll.mockResolvedValue([]);

      const result = await taskController.getAll(userId);

      expect(result.tasks.length).toBe(0);
    });
  });

  describe('getOne', () => {
    it('should call getById method of taskService', async () => {
      mockTaskService.getById.mockResolvedValue(task);

      await taskController.getOne(userId, taskId);

      expect(mockTaskService.getById).toHaveBeenCalledWith(userId, taskId);
    });

    it('should return a task by id', async () => {
      mockTaskService.getById.mockResolvedValue(task);

      const result = await taskController.getOne(userId, taskId);

      expect(result).toEqual({ task: task });
    });

    it('should return null if task not found', async () => {
      mockTaskService.getById.mockResolvedValue(null);

      const result = await taskController.getOne(userId, taskId);

      expect(result.task).toBeNull();
    });
  });

  describe('create', () => {
    let dto: CreateTaskDto;

    beforeEach(() => {
      dto = {
        title: 'New Task',
        description: 'New Description',
      };
    });

    it('should call create method of taskService', async () => {
      mockTaskService.create.mockResolvedValue(task);

      await taskController.create(userId, dto);

      expect(mockTaskService.create).toHaveBeenCalledWith(userId, dto);
    });

    it('should create a new task and return it with a success message', async () => {
      mockTaskService.create.mockResolvedValue(task);

      const result = await taskController.create(userId, dto);

      expect(result).toEqual({
        task: task,
        message: TaskMessageConstants.SUCCESS_CREATE,
      });
    });
  });

  describe('update', () => {
    let dto: UpdateTaskDto;

    beforeEach(() => {
      dto = { title: 'Updated Task' };
    });

    it('should call update method of taskService', async () => {
      mockTaskService.update.mockResolvedValue(task);

      await taskController.update(userId, taskId, dto);

      expect(mockTaskService.update).toHaveBeenCalledWith(userId, taskId, dto);
    });

    it('should update a task and return it with a success message', async () => {
      mockTaskService.update.mockResolvedValue({ ...task, ...dto });

      const result = await taskController.update(userId, taskId, dto);

      expect(result).toEqual({
        task: { ...task, ...dto },
        message: TaskMessageConstants.SUCCESS_UPDATE,
      });
    });
  });

  describe('toggleCompleted', () => {
    beforeEach(() => {
      mockTaskService.toggleIsCompleted.mockResolvedValue({
        ...task,
        isCompleted: true,
      });
    });

    it('should call toggleTaskState method of taskService', async () => {
      mockTaskService.getById.mockResolvedValue(task);

      await taskController.toggleComplete(userId, taskId);

      expect(mockTaskService.toggleIsCompleted).toHaveBeenCalledWith(
        userId,
        taskId,
      );
    });

    it('should toggle the completion state of a task and return the updated task with a message', async () => {
      const result = await taskController.toggleComplete(userId, taskId);

      expect(result).toEqual({
        task: { ...task, isCompleted: true },
        message: TaskMessageConstants.TASK_COMPLETED,
      });
    });
  });

  describe('delete', () => {
    it('should call delete method of taskService', async () => {
      mockTaskService.delete.mockResolvedValue(task);

      await taskController.delete(userId, taskId);

      expect(mockTaskService.delete).toHaveBeenCalledWith(userId, taskId);
    });

    it('should delete a task and return a success message', async () => {
      mockTaskService.delete.mockResolvedValue(task);

      const result = await taskController.delete(userId, taskId);

      expect(result).toEqual({
        task: task,
        message: TaskMessageConstants.SUCCESS_DELETE,
      });
      expect(mockTaskService.delete).toHaveBeenCalledWith(userId, taskId);
    });
  });
});
