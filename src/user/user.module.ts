import { Module } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { UserService } from './user.service';

@Module({
  controllers: [],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
