import { Controller, Get, Logger, Query } from '@nestjs/common';
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
  public constructor(
    private readonly _analyticsService: AnalyticsService,
    private readonly _logger: Logger,
  ) {}

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
    try {
      if (tagId) {
        this._logger.log(
          `Get tag analytics for tag ${tagId} for user with id ${userId}`,
        );
        const analytics = await this._tryGetTagAnalytics(userId, tagId, period);
        this._logger.log(
          `Get tag analytics for tag ${tagId} for user with id ${userId}`,
        );

        return analytics;
      }

      this._logger.log(`Get tags analytics for user with id ${userId}`);
      const analytics = await this._tryGetTagsAnalytics(userId, period);
      this._logger.log(
        `Tags analytics for user with id ${userId} successfully received`,
      );

      return analytics;
    } catch (error) {
      this._logger.warn(
        `Error while getting tags analytics for user with id ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
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
    try {
      this._logger.log(`Get tasks analytics for user with id ${userId}`);
      const analytics = await this._tryGetTasksAnalytics(userId, period);
      this._logger.log(
        `Tasks analytics for user with id ${userId} successfully received`,
      );

      return analytics;
    } catch (error) {
      this._logger.warn(
        `Error while getting tasks analytics for user with id ${userId}. Error message: ${error.message}`,
      );
      throw error;
    }
  }

  private async _tryGetTagAnalytics(
    userId: string,
    tagId: string,
    period?: AnalyticsPeriod,
  ) {
    return this._analyticsService.getTagAnalytics(userId, tagId, period);
  }

  private async _tryGetTagsAnalytics(userId: string, period?: AnalyticsPeriod) {
    return this._analyticsService.getTagsAnalytics(userId, period);
  }

  private async _tryGetTasksAnalytics(
    userId: string,
    period?: AnalyticsPeriod,
  ) {
    return this._analyticsService.getTasksAnalytics(userId, period);
  }
}
