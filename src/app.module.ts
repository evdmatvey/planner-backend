import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsModule } from './analytics';
import { AuthModule } from './auth';
import { TagModule } from './tag';
import { TaskModule } from './task';
import { UserModule } from './user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    TaskModule,
    TagModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
