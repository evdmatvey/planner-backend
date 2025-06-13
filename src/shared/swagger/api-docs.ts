import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

type ApiResponseStatus =
  | 'ok'
  | 'notFound'
  | 'conflict'
  | 'badRequest'
  | 'unauthorized';

type ApiResponseDecorator =
  | typeof ApiBadRequestResponse
  | typeof ApiOkResponse
  | typeof ApiUnauthorizedResponse
  | typeof ApiConflictResponse
  | typeof ApiNotFoundResponse;

interface ApiRouteDocsResponse {
  type: any;
  description: string;
}

interface ApiRouteDocsOptions {
  summary: string;
  apiResponses?: Partial<Record<ApiResponseStatus, ApiRouteDocsResponse>>;
}

const apiResponseDecorators: Record<ApiResponseStatus, ApiResponseDecorator> = {
  ok: ApiOkResponse,
  badRequest: ApiBadRequestResponse,
  conflict: ApiConflictResponse,
  notFound: ApiNotFoundResponse,
  unauthorized: ApiUnauthorizedResponse,
};

const getApiRouteResponseDecorator = (
  status: ApiResponseStatus,
  routeResponse: ApiRouteDocsResponse,
) => {
  const decorator = apiResponseDecorators[status];

  return decorator({
    type: routeResponse.type,
    description: routeResponse.description,
  });
};

export const ApiRouteDocs = (options: ApiRouteDocsOptions) => {
  const apiResponses = Object.entries(options.apiResponses ?? {}).map(
    (apiResponse) => {
      const [status, apiRouteResponse] = apiResponse as [
        ApiResponseStatus,
        ApiRouteDocsResponse,
      ];

      return getApiRouteResponseDecorator(status, apiRouteResponse);
    },
  );

  return applyDecorators(
    ApiOperation({ summary: options.summary }),
    ...apiResponses,
  );
};
