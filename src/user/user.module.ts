import { Logger, Module } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, Logger],
  exports: [UserService],
})
export class UserModule {}
