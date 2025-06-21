import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class InternalServerErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(InternalServerErrorFilter.name);

  public catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (status === 500) {
      const message =
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal server error';

      this.logger.error(
        `HTTP 500 Error on ${request.method} ${request.url} — Message: ${JSON.stringify(message)}`,
        exception instanceof Error ? exception.stack : '',
      );
    }

    if (status === 400) {
      const message =
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal server error';

      this.logger.warn(
        `HTTP 400 Error on ${request.method} ${request.url} — Message: ${JSON.stringify(message)}`,
      );
    }

    response.status(status).json(
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            statusCode: 500,
            message: 'Internal server error',
          },
    );
  }
}
