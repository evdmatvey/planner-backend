import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { UseUser } from '@/auth/decorators/use-user.decorator';
import { ApiRouteDocs } from '@/shared/swagger';
import { NotFoundResponse } from '@/shared/swagger-types/notfound-response';
import {
  UnauthorizedResponse,
  unauthorizedResponseDescription,
} from '@/shared/swagger-types/unauthorized-response';
import { TaskMessageConstants } from './constants/task-message.constants';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';
import {
  TaskWithMessageResponse,
  TaskWithTagsAndMessageResponse,
  TaskWithTagsResponse,
} from './types/task-response.types';

@Auth()
@ApiBearerAuth()
@ApiTags('Задачи')
@UsePipes(new ValidationPipe())
@Controller('tasks')
export class TaskController {
  public constructor(
    private readonly _taskService: TaskService,
    private readonly _logger: Logger,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Получение всех задач',
    apiResponses: {
      ok: {
        type: TaskWithTagsResponse,
        description: 'Все задачи успешно получены',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async getAll(@UseUser('id') userId: string) {
    try {
      this._logger.log(`Get all tasks for user with id: ${userId}`);
      const tasks = await this._tryGetTasks(userId);
      this._logger.log(
        `Tasks for user with id: ${userId} successfully received`,
      );

      return { tasks };
    } catch (error) {
      this._logger.error(
        `Error while getting tasks for user with id: ${userId}`,
        error,
      );
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Получение задачи по id',
    apiResponses: {
      ok: {
        type: TaskWithTagsResponse,
        description: 'Задача успешно получена по id',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: 'Задача не найдена по переданному id',
      },
    },
  })
  public async getOne(
    @UseUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    try {
      this._logger.log(
        `Get task with id: ${taskId} for user with id: ${userId}`,
      );
      const task = await this._tryGetTask(userId, taskId);
      this._logger.log(`Task with id: ${taskId} successfully received`);

      return { task };
    } catch (error) {
      this._logger.warn(
        `Error while getting task with id: ${taskId} for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Post()
  @HttpCode(201)
  @ApiRouteDocs({
    summary: 'Создание задачи',
    apiResponses: {
      ok: {
        type: TaskWithTagsAndMessageResponse,
        description: 'Задача успешно создана',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
    },
  })
  public async create(
    @UseUser('id') userId: string,
    @Body() dto: CreateTaskDto,
  ) {
    try {
      this._logger.log(
        `Create task for user with id: ${userId} with title: ${dto.title}`,
      );
      const task = await this._tryCreateTask(userId, dto);
      this._logger.log(
        `Task with id: ${task.id} for user with id: ${userId} successfully created`,
      );

      return {
        task,
        message: TaskMessageConstants.SUCCESS_CREATE,
      };
    } catch (error) {
      this._logger.warn(
        `Error while creating task for user with id: ${userId} with title: ${dto.title}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Обновление задачи',
    apiResponses: {
      ok: {
        type: TaskWithTagsAndMessageResponse,
        description: 'Задача успешно обновлена',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: 'Задача не найдена по переданному id',
      },
    },
  })
  public async update(
    @UseUser('id') userId: string,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    try {
      this._logger.log(
        `Update task with id: ${taskId} for user with id: ${userId} with title: ${dto.title}`,
      );
      const task = await this._tryUpdateTask(userId, taskId, dto);
      this._logger.log(
        `Task with id: ${taskId} for user with id: ${userId} successfully updated`,
      );

      return {
        task,
        message: TaskMessageConstants.SUCCESS_UPDATE,
      };
    } catch (error) {
      this._logger.warn(
        `Error while updating task with id: ${taskId} for user with id: ${userId} with title: ${dto.title}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Переключение задача выполнена/не выполнена',
    apiResponses: {
      ok: {
        type: TaskWithMessageResponse,
        description: 'Статус задачи успешно переключен',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: 'Задача не найдена по переданному id',
      },
    },
  })
  public async toggleComplete(
    @UseUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    try {
      this._logger.log(
        `Toggle complete task with id: ${taskId} for user with id: ${userId}`,
      );
      const task = await this._tryToggleComplete(userId, taskId);
      this._logger.log(
        `Task with id: ${taskId} for user with id: ${userId} successfully toggled`,
      );

      return {
        task,
        message: task.isCompleted
          ? TaskMessageConstants.TASK_COMPLETED
          : TaskMessageConstants.TASK_UNCOMPLETED,
      };
    } catch (error) {
      this._logger.warn(
        `Error while toggling task with id: ${taskId} for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiRouteDocs({
    summary: 'Удаление задачи',
    apiResponses: {
      ok: {
        type: TaskWithMessageResponse,
        description: 'Задача успешно удалена',
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: 'Задача не найдена по переданному id',
      },
    },
  })
  public async delete(
    @UseUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    try {
      this._logger.log(
        `Delete task with id: ${taskId} for user with id: ${userId}`,
      );
      const task = await this._tryDeleteTask(userId, taskId);
      this._logger.log(
        `Task with id: ${taskId} for user with id: ${userId} successfully deleted`,
      );

      return {
        task,
        message: TaskMessageConstants.SUCCESS_DELETE,
      };
    } catch (error) {
      this._logger.warn(
        `Error while deleting task with id: ${taskId} for user with id: ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  private async _tryGetTasks(userId: string) {
    const tasks = await this._taskService.getAll(userId);

    return tasks;
  }

  private async _tryGetTask(userId: string, taskId: string) {
    const task = await this._taskService.getById(userId, taskId);

    return task;
  }

  private async _tryCreateTask(userId: string, dto: CreateTaskDto) {
    const task = await this._taskService.create(userId, dto);

    return task;
  }

  private async _tryUpdateTask(
    userId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ) {
    const task = await this._taskService.update(userId, taskId, dto);

    return task;
  }

  private async _tryToggleComplete(userId: string, taskId: string) {
    const task = await this._taskService.toggleIsCompleted(userId, taskId);

    return task;
  }

  private async _tryDeleteTask(userId: string, taskId: string) {
    const task = await this._taskService.delete(userId, taskId);

    return task;
  }
}
