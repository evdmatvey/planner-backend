import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from '../metrics.service';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  public constructor(private readonly _metricsService: MetricsService) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    const start = Date.now();
    const route = this._getRouteName(request);

    return next.handle().pipe(
      tap({
        next: () => this._recordSuccess(request, response, route, start),
        error: () => this._reecordError(request, route, start),
      }),
    );
  }

  private _getRouteName(request: any): string {
    return request.route?.path || request.url.split('?')[0];
  }

  private _recordSuccess(
    request: any,
    response: any,
    route: string,
    start: number,
  ) {
    const duration = (Date.now() - start) / 1000;
    this._metricsService.recordHttpRequest(
      request.method,
      route,
      response.statusCode,
      duration,
    );
  }

  private _reecordError(request: any, route: string, start: number) {
    const duration = (Date.now() - start) / 1000;
    this._metricsService.recordHttpRequest(
      request.method,
      route,
      500,
      duration,
    );
  }
}
