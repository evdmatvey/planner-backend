import { Module } from '@nestjs/common';
import { HttpMetricsInterceptor } from './interceptors/http-metrics.interceptor';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

// TODO: remove Prometheus metrics (#24)

@Module({
  controllers: [MetricsController],
  providers: [MetricsService, HttpMetricsInterceptor],
  exports: [MetricsService, HttpMetricsInterceptor],
})
export class MetricsModule {}
