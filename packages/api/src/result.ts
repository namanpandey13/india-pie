import type { ApiError, ApiResult } from '@hausy/types';

export function ok<T>(data: T): ApiResult<T> {
  return { data, error: null };
}

export function fail<T>(code: string, message: string, retryable = false): ApiResult<T> {
  return {
    data: null,
    error: {
      code,
      message,
      retryable,
    },
  };
}

export function toApiError(error: unknown, fallback = 'Something went wrong.'): ApiError {
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      code: 'unexpected_error',
      message: String((error as { message: unknown }).message || fallback),
      retryable: true,
    };
  }

  return {
    code: 'unexpected_error',
    message: fallback,
    retryable: true,
  };
}
