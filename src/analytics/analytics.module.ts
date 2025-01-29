import { Module } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { TagModule } from '@/tag';
import { TaskModule } from '@/task';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [TagModule, TaskModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PrismaService],
})
export class AnalyticsModule {}
