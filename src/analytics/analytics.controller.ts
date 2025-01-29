import { Controller } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  public constructor(private readonly _analyticsService: AnalyticsService) {}
}
