import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { UseUser } from '@/auth/decorators/use-user.decorator';
import { AnalyticsService } from './analytics.service';
import { AnalyticsPeriod } from './types/analytics-period.type';
import {
  TagAnalyticsResponse,
  TaskAnalyticsResponse,
} from './types/analytics.response';

@Auth()
@ApiBearerAuth()
@Controller('analytics')
@ApiTags('Аналитика')
export class AnalyticsController {
  public constructor(private readonly _analyticsService: AnalyticsService) {}

  @Get('/tags')
  @ApiQuery({
    name: 'tagId',
    required: false,
    description: 'Получение аналитики по 1 тегу',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Временной период (week, month, year, all)',
  })
  @ApiOperation({
    summary: 'Получение аналитики тегов',
    description:
      'Данные тегов, их задачи по датам, кол-во задач и время выполнения по статусу',
  })
  @ApiOkResponse({ type: TagAnalyticsResponse, isArray: true })
  public async getTagsAnalytics(
    @UseUser('id') userId: string,
    @Query('tagId') tagId?: string,
    @Query('period') period?: AnalyticsPeriod,
  ) {
    if (tagId)
      return this._analyticsService.getTagAnalytics(userId, tagId, period);

    return this._analyticsService.getTagsAnalytics(userId, period);
  }

  @Get('/tasks')
  @ApiOperation({
    summary: 'Получение аналитики задач',
    description:
      'Массив с датами и информацией о задачах на эту дату (выполнено, не выполнено, все)',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Временной период (week, month, year, all)',
  })
  @ApiOkResponse({ type: TaskAnalyticsResponse, isArray: true })
  public async getTasksAnalytics(
    @UseUser('id') userId: string,
    @Query('period') period?: AnalyticsPeriod,
  ) {
    return this._analyticsService.getTasksAnalytics(userId, period);
  }
}
