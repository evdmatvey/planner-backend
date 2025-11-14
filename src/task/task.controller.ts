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
import {
  ApiRouteDocs,
  BadRequestResponse,
  badRequestResponseDescription,
} from '@/shared/swagger';
import { NotFoundResponse } from '@/shared/swagger-types/notfound-response';
import {
  UnauthorizedResponse,
  unauthorizedResponseDescription,
} from '@/shared/swagger-types/unauthorized-response';
import { TaskMessageConstants } from './constants/task-message.constants';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  TaskRouteConstants,
  TaskSummaryConstants,
  TaskWithMessageResponse,
  TaskWithTagsAndMessageResponse,
  TaskWithTagsResponse,
} from './swagger';
import { TaskService } from './task.service';

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
    summary: TaskSummaryConstants.GET_ALL,
    apiResponses: {
      ok: {
        type: TaskWithTagsResponse,
        description: TaskRouteConstants.GET_ALL.OK,
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
    summary: TaskSummaryConstants.GET_ONE,
    apiResponses: {
      ok: {
        type: TaskWithTagsResponse,
        description: TaskRouteConstants.GET_ONE.OK,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: TaskRouteConstants.GET_ONE.NOT_FOUND,
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
    summary: TaskSummaryConstants.CREATE,
    apiResponses: {
      ok: {
        type: TaskWithTagsAndMessageResponse,
        description: TaskRouteConstants.CREATE.OK,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
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
    summary: TaskSummaryConstants.UPDATE,
    apiResponses: {
      ok: {
        type: TaskWithTagsAndMessageResponse,
        description: TaskRouteConstants.UPDATE.OK,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: TaskRouteConstants.UPDATE.NOT_FOUND,
      },
      badRequest: {
        type: BadRequestResponse,
        description: badRequestResponseDescription,
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
    summary: TaskSummaryConstants.TOGGLE_COMPLETE,
    apiResponses: {
      ok: {
        type: TaskWithMessageResponse,
        description: TaskRouteConstants.TOGGLE_COMPLETE.OK,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: TaskRouteConstants.TOGGLE_COMPLETE.NOT_FOUND,
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
    summary: TaskSummaryConstants.DELETE,
    apiResponses: {
      ok: {
        type: TaskWithMessageResponse,
        description: TaskRouteConstants.DELETE.OK,
      },
      unauthorized: {
        type: UnauthorizedResponse,
        description: unauthorizedResponseDescription,
      },
      notFound: {
        type: NotFoundResponse,
        description: TaskRouteConstants.DELETE.NOT_FOUND,
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
