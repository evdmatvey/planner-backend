import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TurnstileModule } from 'nestjs-cloudflare-captcha';
import { AnalyticsModule } from './analytics';
import { AuthModule } from './auth';
import { FinancesModule } from './finances/finances.module';
import { TagModule } from './tag';
import { TaskModule } from './task';
import { UserModule } from './user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TurnstileModule.forRoot({
      secretKey: process.env.CAPTCHA_SECRET_KEY,
      token: (req) => req.body.captchaToken,
      skipIf:
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test',
    }),
    PrometheusModule.register(),
    UserModule,
    AuthModule,
    TaskModule,
    TagModule,
    AnalyticsModule,
    FinancesModule,
  ],
})
export class AppModule {}
