/**
 * Generic API Response Wrapper
 * Standard response structure for all API endpoints
 */

export interface ResponseApi<T> {
  data: T;
  message: string;
  meta?: {
    limit: number;
    page: number;
    total: number;
    total_pages: number;
  };
  errors?: any;
}

/**
 * API Response with required meta (for paginated responses)
 */
export type ResponseApiWithMeta<T> = ResponseApi<T> & {
  meta: NonNullable<ResponseApi<T>['meta']>;
};

export type ErrorResponseApi = {
  error: string;
  message: string;
}