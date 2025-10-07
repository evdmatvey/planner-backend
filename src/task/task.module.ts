import { Logger, Module } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, Logger],
  exports: [TaskService],
})
export class TaskModule {}
