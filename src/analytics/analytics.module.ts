import { Module } from '@nestjs/common';
import { TagModule } from '@/tag';
import { TaskModule } from '@/task';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [TagModule, TaskModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
