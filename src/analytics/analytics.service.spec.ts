import { Test, TestingModule } from '@nestjs/testing';
import { Color, Priority, Tag } from '@prisma/__generated__';
import * as dayjs from 'dayjs';
import { TagService } from '@/tag/tag.service';
import { TaskService } from '@/task/task.service';
import { AnalyticsService } from './analytics.service';
import { AnalyticsPeriod } from './types/analytics-period.type';
import { AnalyticsTask } from './types/analytics-task.type';

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let tagService: TagService;
  let taskService: TaskService;
  let tag: Tag & { tasks: AnalyticsTask[] };
  let task;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: TagService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
          },
        },
        {
          provide: TaskService,
          useValue: {
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    analyticsService = module.get<AnalyticsService>(AnalyticsService);
    tagService = module.get<TagService>(TagService);
    taskService = module.get<TaskService>(TaskService);
    task = {
      id: 'task-id',
      executionTime: 100,
      createdAt: new Date(),
      isCompleted: true,
      updatedAt: new Date(),
      title: '',
      tags: [],
      userId: '',
      description: '',
      priority: Priority.HIGH,
    };
    tag = {
      id: 'tag-id',
      title: 'Tag Title',
      color: Color.ACCENT,
      userId: 'user-id',
      createdAt: new Date(0),
      updatedAt: new Date(0),
      tasks: [task],
    };
  });

  describe('getTasksAnalytics', () => {
    it('should return grouped tasks info without period filter', async () => {
      const userId = 'user-id';
      const tasks = [task];

      jest.spyOn(taskService, 'getAll').mockResolvedValue(tasks);

      const result = await analyticsService.getTasksAnalytics(userId, null);

      expect(taskService.getAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(analyticsService['_getGroupedTasksInfo'](tasks));
    });

    it('should return grouped tasks info with period filter', async () => {
      const userId = 'user-id';
      const period: AnalyticsPeriod = 'week';
      const tasks = [];

      jest.spyOn(taskService, 'getAll').mockResolvedValue(tasks);
      jest
        .spyOn(analyticsService as any, '_filterGroupsByPeriod')
        .mockReturnValue([]);

      const result = await analyticsService.getTasksAnalytics(userId, period);

      expect(taskService.getAll).toHaveBeenCalledWith(userId);
      expect(analyticsService['_filterGroupsByPeriod']).toHaveBeenCalledWith(
        analyticsService['_getGroupedTasksInfo'](tasks),
        period,
      );
      expect(result).toEqual([]);
    });
  });

  describe('getTagsAnalytics', () => {
    it('should return tags analytics without period filter', async () => {
      const userId = 'user-id';
      const tags = [tag];

      jest.spyOn(tagService, 'getAll').mockResolvedValue(tags);

      const result = await analyticsService.getTagsAnalytics(userId, null);

      expect(tagService.getAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(
        tags.map((tag) => analyticsService['_transformTagTasksToGroups'](tag)),
      );
    });

    it('should return tags analytics with period filter', async () => {
      const userId = 'user-id';
      const period: AnalyticsPeriod = 'month';
      const tags = [tag];

      jest.spyOn(tagService, 'getAll').mockResolvedValue(tags);
      jest
        .spyOn(analyticsService as any, '_filterGroupsByPeriod')
        .mockReturnValue([]);

      const result = await analyticsService.getTagsAnalytics(userId, period);

      expect(tagService.getAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(
        tags.map((tag) => ({
          ...analyticsService['_transformTagTasksToGroups'](tag),
          tasks: [],
        })),
      );
    });
  });

  describe('getTagAnalytics', () => {
    it('should return tag analytics without period filter', async () => {
      const userId = 'user-id';
      const tagId = 'tag-id';

      jest.spyOn(tagService, 'getById').mockResolvedValue(tag);

      const result = await analyticsService.getTagAnalytics(
        userId,
        tagId,
        null,
      );

      expect(tagService.getById).toHaveBeenCalledWith(userId, tagId);
      expect(result).toEqual([
        analyticsService['_transformTagTasksToGroups'](tag),
      ]);
    });

    it('should return tag analytics with period filter', async () => {
      const userId = 'user-id';
      const tagId = 'tag-id';
      const period: AnalyticsPeriod = 'year';

      jest.spyOn(tagService, 'getById').mockResolvedValue(tag);
      jest
        .spyOn(analyticsService as any, '_filterGroupsByPeriod')
        .mockReturnValue([]);

      const result = await analyticsService.getTagAnalytics(
        userId,
        tagId,
        period,
      );

      expect(tagService.getById).toHaveBeenCalledWith(userId, tagId);
      expect(result).toEqual([
        {
          ...analyticsService['_transformTagTasksToGroups'](tag),
          tasks: [],
        },
      ]);
    });
  });

  describe('_transformTagTasksToGroups', () => {
    it('should transform tag tasks to groups', () => {
      const result = analyticsService['_transformTagTasksToGroups'](tag);

      expect(result).toEqual({
        id: tag.id,
        title: tag.title,
        color: tag.color,
        tasks: analyticsService['_getGroupedTasksInfo'](tag.tasks),
      });
    });
  });

  describe('_filterGroupsByPeriod', () => {
    it('should return all groups if period is "all"', () => {
      const groups: any[] = [
        { date: '01.01.2023', tasks: [] },
        { date: '02.01.2023', tasks: [] },
      ];
      const period: AnalyticsPeriod = 'all';

      const result = analyticsService['_filterGroupsByPeriod'](groups, period);

      expect(result).toEqual(groups);
    });
  });

  describe('_getGroupedTasksInfo', () => {
    it('should return grouped tasks info', () => {
      const tasks: AnalyticsTask[] = [
        {
          id: 'task-id',
          executionTime: 100,
          createdAt: new Date(),
          isCompleted: true,
        },
      ];

      const result = analyticsService['_getGroupedTasksInfo'](tasks);

      expect(result).toEqual([
        {
          date: dayjs(tasks[0].createdAt).format('DD.MM.YYYY'),
          tasks: {
            todo: {
              count: 0,
              executionTime: 0,
            },
            completed: {
              count: 1,
              executionTime: 100,
            },
            all: {
              count: 1,
              executionTime: 100,
            },
          },
        },
      ]);
    });
  });

  describe('_getTasksInfo', () => {
    it('should return tasks info', () => {
      const tasks: AnalyticsTask[] = [
        {
          id: 'task-id',
          executionTime: 100,
          createdAt: new Date(),
          isCompleted: true,
        },
        {
          id: 'task-id-2',
          executionTime: 200,
          createdAt: new Date(),
          isCompleted: false,
        },
      ];

      const result = analyticsService['_getTasksInfo'](tasks);

      expect(result).toEqual({
        todo: {
          count: 1,
          executionTime: 200,
        },
        completed: {
          count: 1,
          executionTime: 100,
        },
        all: {
          count: 2,
          executionTime: 300,
        },
      });
    });
  });

  describe('_getTotalExecutionTime', () => {
    it('should return total execution time', () => {
      const tasks = [
        { executionTime: 100 },
        { executionTime: 200 },
        { executionTime: undefined },
      ];

      const result = analyticsService['_getTotalExecutionTime'](tasks);

      expect(result).toEqual(300);
    });
  });

  describe('_compareFormattedDates', () => {
    it('should compare formatted dates', () => {
      const date1 = '01.01.2023';
      const date2 = '02.01.2023';

      const result = analyticsService['_compareFormattedDates'](date1, date2);

      expect(result).toEqual(-1);
    });
  });

  describe('_convertToISO', () => {
    it('should convert date string to ISO', () => {
      const dateString = '01.01.2023';

      const result = analyticsService['_convertToISO'](dateString);

      expect(result).toEqual(dayjs('2023-01-01').toISOString());
    });
  });
});
