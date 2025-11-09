import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  public constructor(private readonly _taskService: TaskService) {}

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
    const tasks = await this._taskService.getAll(userId);

    return { tasks };
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
    const task = await this._taskService.getById(userId, taskId);

    return { task };
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
    const task = await this._taskService.create(userId, dto);

    return {
      task,
      message: TaskMessageConstants.SUCCESS_CREATE,
    };
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
    const task = await this._taskService.update(userId, taskId, dto);

    return {
      task,
      message: TaskMessageConstants.SUCCESS_UPDATE,
    };
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
    const task = await this._taskService.toggleIsCompleted(userId, taskId);

    return {
      task,
      message: task.isCompleted
        ? TaskMessageConstants.TASK_COMPLETED
        : TaskMessageConstants.TASK_UNCOMPLETED,
    };
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
    const task = await this._taskService.delete(userId, taskId);

    return {
      task,
      message: TaskMessageConstants.SUCCESS_DELETE,
    };
  }
}
