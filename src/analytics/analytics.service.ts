import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/__generated__';
import * as dayjs from 'dayjs';
import { TagService } from '@/tag';
import { TaskService } from '@/task';
import { AnalyticsPeriod } from './types/analytics-period.type';
import { AnalyticsTask } from './types/analytics-task.type';
import { TaskGroups, TasksInfoByGroups } from './types/tasks-info.type';

@Injectable()
export class AnalyticsService {
  public constructor(
    private readonly _taskService: TaskService,
    private readonly _tagService: TagService,
  ) {}

  public async getTasksAnalytics(userId: string, period: AnalyticsPeriod) {
    const tasks = await this._taskService.getAll(userId);
    const groupedTasksInfo = this._getGroupedTasksInfo(tasks);

    if (period) {
      return this._filterGroupsByPeriod(groupedTasksInfo, period);
    }

    return groupedTasksInfo;
  }

  public async getTagsAnalytics(userId: string, period?: AnalyticsPeriod) {
    const tags = await this._tagService.getAll(userId);

    const analyticsTags = tags.map((tag) =>
      this._transformTagTasksToGroups(tag),
    );

    if (period) {
      return analyticsTags.map((tag) => ({
        ...tag,
        tasks: this._filterGroupsByPeriod(tag.tasks, period),
      }));
    }

    return analyticsTags;
  }

  public async getTagAnalytics(
    userId: string,
    tagId: string,
    period?: AnalyticsPeriod,
  ) {
    const tag = await this._tagService.getById(userId, tagId);

    const tagWithTasksGroups = this._transformTagTasksToGroups(tag);

    if (period)
      return [
        {
          ...tagWithTasksGroups,
          tasks: this._filterGroupsByPeriod(tagWithTasksGroups.tasks, period),
        },
      ];

    return [tagWithTasksGroups];
  }

  private _transformTagTasksToGroups(tag: Tag & { tasks: AnalyticsTask[] }) {
    const groupedTagTasksInfo = this._getGroupedTasksInfo(tag.tasks);

    return {
      id: tag.id,
      title: tag.title,
      color: tag.color,
      tasks: groupedTagTasksInfo,
    };
  }

  private _filterGroupsByPeriod(groups: TaskGroups[], period: AnalyticsPeriod) {
    if (period === 'all') return groups;

    const filteredGroups: TaskGroups[] = [];
    const currentDate = dayjs();

    const periodChecks: Record<
      AnalyticsPeriod,
      (date: dayjs.Dayjs) => boolean
    > = {
      week: (date) => date.isSame(currentDate, 'week'),
      month: (date) => date.isSame(currentDate, 'month'),
      year: (date) => date.isSame(currentDate, 'year'),
      all: () => true,
    };

    groups.forEach((group) => {
      const groupDate = dayjs(this._convertToISO(group.date));

      if (periodChecks[period](groupDate)) {
        filteredGroups.push(group);
      }
    });

    return filteredGroups;
  }

  private _getGroupedTasksInfo(tasks: AnalyticsTask[]) {
    const groupedTagTasksByDate = this._groupTasksByDate(tasks);
    const groupedTagTasksInfo = groupedTagTasksByDate.map((group) => ({
      date: group.date,
      tasks: this._getTasksInfo(group.tasks),
    }));

    return groupedTagTasksInfo;
  }

  private async _getAllTagsAnalytics(userId: string) {
    const tags = await this._tagService.getAll(userId);

    const analyticsTags = tags.map((tag) => {
      const groupedTagTasksByDate = this._groupTasksByDate(tag.tasks);
      const groupedTagTasksInfo = groupedTagTasksByDate.map((group) => ({
        date: group.date,
        tasks: this._getTasksInfo(group.tasks),
      }));

      return {
        id: tag.id,
        title: tag.title,
        color: tag.color,
        tasks: groupedTagTasksInfo,
      };
    });

    return analyticsTags;
  }

  private _groupTasksByDate(tasks: AnalyticsTask[]) {
    const groups: Record<string, AnalyticsTask[]> = {};

    for (const task of tasks) {
      const date = dayjs(task.createdAt).format('DD.MM.YYYY');

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(task);
    }

    const sortedGroups = Object.entries(groups)
      .map(([date, tasks]) => ({ date, tasks }))
      .sort((a, b) => this._compareFormattedDates(a.date, b.date));

    return sortedGroups;
  }

  private _getTasksInfo(tasks: AnalyticsTask[]): TasksInfoByGroups {
    const totalExecutionTime = this._getTotalExecutionTime(tasks);

    const completedTasks = tasks.filter((task) => task.isCompleted);
    const completedTasksExecutionTime =
      this._getTotalExecutionTime(completedTasks);

    return {
      todo: {
        count: tasks.length - completedTasks.length,
        executionTime: totalExecutionTime - completedTasksExecutionTime,
      },
      completed: {
        count: completedTasks.length,
        executionTime: completedTasksExecutionTime,
      },
      all: {
        count: tasks.length,
        executionTime: totalExecutionTime,
      },
    };
  }

  private _getTotalExecutionTime(tasks: { executionTime?: number }[]) {
    const executionTime = tasks.reduce(
      (acc, task) => acc + (task.executionTime ? task.executionTime : 0),
      0,
    );

    return executionTime;
  }

  private _compareFormattedDates(date1: string, date2: string) {
    const compare = dayjs(this._convertToISO(date1)).isBefore(
      dayjs(this._convertToISO(date2)),
    );

    return compare ? -1 : 1;
  }

  private _convertToISO(dateString: string): string {
    const [day, month, year] = dateString.split('.');
    const formattedDate = `${year}-${month}-${day}`;

    return dayjs(formattedDate).toISOString();
  }
}
