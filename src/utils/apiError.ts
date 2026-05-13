import axios from 'axios';

export interface ApiRequestError {
  name: 'ApiRequestError' | 'AbortError';
  message: string;
  statusCode: number;
  code: string;
  retryable: boolean;
}

export const createApiRequestError = ({
  message,
  code,
  statusCode,
  retryable = true,
}: {
  message: string;
  code: string;
  statusCode: number;
  retryable?: boolean;
}): ApiRequestError => ({
  name: 'ApiRequestError',
  message,
  statusCode,
  code,
  retryable,
});

export const createAbortRequestError = (
  message = 'The request was canceled before it completed.',
): ApiRequestError => ({
  name: 'AbortError',
  message,
  statusCode: 0,
  code: 'REQUEST_CANCELED',
  retryable: false,
});

export const isApiRequestError = (error: unknown): error is ApiRequestError => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as Partial<ApiRequestError>;

  return (
    (candidate.name === 'ApiRequestError' || candidate.name === 'AbortError') &&
    typeof candidate.message === 'string' &&
    typeof candidate.statusCode === 'number' &&
    typeof candidate.code === 'string' &&
    typeof candidate.retryable === 'boolean'
  );
};

export const normalizeApiRequestError = (error: unknown): ApiRequestError => {
  if (isApiRequestError(error)) {
    return error;
  }

  if (
    axios.isCancel(error) ||
    (error instanceof DOMException && error.name === 'AbortError')
  ) {
    return createAbortRequestError();
  }

  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status ?? 500;
    const code =
      error.code === 'ECONNABORTED'
        ? 'API_TIMEOUT'
        : 'API_HTTP_ERROR';
    const message = error.response
      ? `API responded with HTTP ${statusCode}.`
      : error.message;

    return createApiRequestError({
      message,
      code,
      statusCode,
    });
  }

  if (error instanceof Error) {
    return createApiRequestError({
      message: error.message,
      code: 'UNKNOWN_API_ERROR',
      statusCode: 500,
    });
  }

  return createApiRequestError({
    message: 'Unknown API error.',
    code: 'UNKNOWN_API_ERROR',
    statusCode: 500,
  });
};
