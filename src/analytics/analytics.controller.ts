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
import {
  AnalyticsRouteConstants,
  AnalyticsSummaryConstants,
  TagAnalyticsResponse,
  TaskAnalyticsResponse,
} from './swagger';
import { AnalyticsPeriod } from './types/analytics-period.type';

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
    summary: AnalyticsSummaryConstants.GET_TAGS_ANALYTICS,
  })
  @ApiOkResponse({
    type: TagAnalyticsResponse,
    isArray: true,
    description: AnalyticsRouteConstants.GET_TAGS_ANALYTICS.OK,
  })
  public async getTagsAnalytics(
    @UseUser('id') userId: string,
    @Query('tagId') tagId?: string,
    @Query('period') period?: AnalyticsPeriod,
  ) {
    if (tagId) {
      const analytics = await this._analyticsService.getTagAnalytics(
        userId,
        tagId,
        period,
      );

      return analytics;
    }

    const analytics = await this._analyticsService.getTagsAnalytics(
      userId,
      period,
    );

    return analytics;
  }

  @Get('/tasks')
  @ApiOperation({
    summary: AnalyticsSummaryConstants.GET_TASKS_ANALYTICS,
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Временной период (week, month, year, all)',
  })
  @ApiOkResponse({
    type: TaskAnalyticsResponse,
    isArray: true,
    description: AnalyticsRouteConstants.GET_TASKS_ANALYTICS.OK,
  })
  public async getTasksAnalytics(
    @UseUser('id') userId: string,
    @Query('period') period?: AnalyticsPeriod,
  ) {
    const analytics = await this._analyticsService.getTasksAnalytics(
      userId,
      period,
    );

    return analytics;
  }
}
