import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly _httpRequestsCounter: Counter;
  private readonly _httpRequestsDuration: Histogram;
  private readonly _databaseQueryDuration: Histogram;

  public constructor() {
    this._httpRequestsCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total count of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this._httpRequestsDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP requests duration',
      labelNames: ['method', 'route'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    this._databaseQueryDuration = new Histogram({
      name: 'db_query_duration_seconds',
      help: 'Database query duration',
      labelNames: ['operation', 'table'],
      buckets: [0.01, 0.05, 0.1, 0.5],
    });
  }

  public recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
  ) {
    this._httpRequestsCounter
      .labels(method, route, statusCode.toString())
      .inc();
    this._httpRequestsDuration.labels(method, route).observe(duration);
  }

  public recordDbQuery(operation: string, table: string, duration: number) {
    this._databaseQueryDuration.labels(operation, table).observe(duration);
  }

  public async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
