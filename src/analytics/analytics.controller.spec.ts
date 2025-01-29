import { Test, TestingModule } from '@nestjs/testing';
import { Color, Priority } from '@prisma/__generated__';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsPeriod } from './types/analytics-period.type';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;
  let tag;
  let task;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: {
            getTagAnalytics: jest.fn(),
            getTagsAnalytics: jest.fn(),
            getTasksAnalytics: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);

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

  describe('getTagsAnalytics', () => {
    it('should return tag analytics when tagId is provided', async () => {
      const tagId = 'mockTagId';
      const period = 'week' as AnalyticsPeriod;
      const result = [tag];

      jest.spyOn(service, 'getTagAnalytics').mockResolvedValueOnce(result);

      const response = await controller.getTagsAnalytics(
        'mockUserId',
        tagId,
        period,
      );
      expect(response).toEqual(result);
      expect(service.getTagAnalytics).toHaveBeenCalledTimes(1);
      expect(service.getTagAnalytics).toHaveBeenCalledWith(
        'mockUserId',
        tagId,
        period,
      );
    });

    it('should return all tags analytics when tagId is not provided', async () => {
      const period = 'month' as AnalyticsPeriod;
      const result = [tag];

      jest.spyOn(service, 'getTagsAnalytics').mockResolvedValueOnce(result);

      const response = await controller.getTagsAnalytics(
        'mockUserId',
        undefined,
        period,
      );
      expect(response).toEqual(result);
      expect(service.getTagsAnalytics).toHaveBeenCalledTimes(1);
      expect(service.getTagsAnalytics).toHaveBeenCalledWith(
        'mockUserId',
        period,
      );
    });
  });

  describe('getTasksAnalytics', () => {
    it('should return tasks analytics', async () => {
      const period = 'year' as AnalyticsPeriod;
      const result = [
        {
          date: 'mockDate',
          tasks: {
            todo: { count: 1, executionTime: 60 },
            completed: { count: 1, executionTime: 60 },
            all: { count: 1, executionTime: 60 },
          },
        },
      ];

      jest.spyOn(service, 'getTasksAnalytics').mockResolvedValueOnce(result);

      const response = await controller.getTasksAnalytics('mockUserId', period);
      expect(response).toEqual(result);
      expect(service.getTasksAnalytics).toHaveBeenCalledTimes(1);
      expect(service.getTasksAnalytics).toHaveBeenCalledWith(
        'mockUserId',
        period,
      );
    });
  });
});
