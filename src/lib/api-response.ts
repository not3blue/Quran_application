/**
 * API Response Helpers
 * Standardized response formats for API routes
 */

import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  meta?: {
    timestamp: string;
    version: string;
    cached?: boolean;
  };
}

/**
 * Create a successful API response
 */
export function apiSuccess<T>(data: T, options: { cached?: boolean } = {}): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      cached: options.cached,
    },
  });
}

/**
 * Create an error API response
 */
export function apiError(
  code: string,
  message: string,
  options: {
    status?: number;
    details?: string;
  } = {}
): NextResponse<ApiResponse> {
  const { status = 400, details } = options;

  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
      },
    },
    { status }
  );
}

/**
 * Error codes
 */
export const ErrorCodes = {
  // Client errors (4xx)
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // Server errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',

  // Network errors
  TIMEOUT: 'TIMEOUT',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

/**
 * Handle API errors with appropriate response
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  // Handle known error types
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Timeout errors
    if (message.includes('timeout') || message.includes('abort')) {
      return apiError(
        ErrorCodes.TIMEOUT,
        'انتهت مهلة الاتصال',
        { status: 504, details: error.message }
      );
    }

    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('ECONNREFUSED')) {
      return apiError(
        ErrorCodes.NETWORK_ERROR,
        'خطأ في الاتصال بالشبكة',
        { status: 503, details: error.message }
      );
    }

    // External API errors
    if (message.includes('api') || message.includes('aladhan')) {
      return apiError(
        ErrorCodes.EXTERNAL_API_ERROR,
        'خطأ في الخدمة الخارجية',
        { status: 502, details: error.message }
      );
    }

    // Database errors
    if (message.includes('prisma') || message.includes('database') || message.includes('sql')) {
      return apiError(
        ErrorCodes.DATABASE_ERROR,
        'خطأ في قاعدة البيانات',
        { status: 500, details: error.message }
      );
    }
  }

  // Generic internal error
  return apiError(
    ErrorCodes.INTERNAL_ERROR,
    'حدث خطأ غير متوقع',
    { status: 500, details: error instanceof Error ? error.message : 'Unknown error' }
  );
}

/**
 * Wrap an API handler with error handling
 */
export function withErrorHandling<T>(
  handler: () => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  return handler().catch(handleApiError);
}
