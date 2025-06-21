import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@Controller('metrics')
@ApiExcludeController()
export class MetricsController {
  public constructor(private readonly _metricsService: MetricsService) {}

  @Get()
  @Header('Content-type', 'text/plain')
  public async getMetrics() {
    return this._metricsService.getMetrics();
  }
}
