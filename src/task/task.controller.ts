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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { UseUser } from '@/auth/decorators/use-user.decorator';
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

@ApiBearerAuth()
@ApiTags('Задачи')
@Controller('tasks')
export class TaskController {
  public constructor(private readonly _taskService: TaskService) {}

  @Get()
  @Auth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Получение всех задач' })
  @ApiOkResponse({ type: TaskWithTagsResponse, isArray: true })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
  })
  public async getAll(@UseUser('id') userId: string) {
    const tasks = await this._taskService.getAll(userId);

    return { tasks };
  }

  @Get(':id')
  @Auth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Получение задачи по id' })
  @ApiOkResponse({ type: TaskWithTagsResponse })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
  })
  public async getOne(
    @UseUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    const task = await this._taskService.getById(userId, taskId);

    return { task };
  }

  @Post()
  @Auth()
  @HttpCode(201)
  @ApiOperation({ summary: 'Создание задачи' })
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ type: TaskWithTagsAndMessageResponse })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
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
  @Auth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Обновление задачи' })
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ type: TaskWithTagsAndMessageResponse })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
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
  @Auth()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Переключение задача выполнена/не выполнена',
  })
  @ApiOkResponse({ type: TaskWithMessageResponse })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
  })
  @ApiNotFoundResponse({
    type: NotFoundResponse,
    description: 'Задача не найдена по переданному id',
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
  @Auth()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Удаление задачи',
  })
  @ApiOkResponse({ type: TaskWithMessageResponse })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: unauthorizedResponseDescription,
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
