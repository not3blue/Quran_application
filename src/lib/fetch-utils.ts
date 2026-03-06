/**
 * Fetch Utility with Retry Logic and Error Handling
 */

export interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface FetchError extends Error {
  status?: number;
  statusText?: string;
  type: 'network' | 'timeout' | 'server' | 'parse' | 'abort' | 'unknown';
  retryCount?: number;
}

/**
 * Create a standardized fetch error
 */
function createFetchError(
  message: string,
  type: FetchError['type'],
  options: Partial<FetchError> = {}
): FetchError {
  const error = new Error(message) as FetchError;
  error.type = type;
  Object.assign(error, options);
  return error;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Determine error type from response or error
 */
function getErrorType(error: unknown, response?: Response): FetchError['type'] {
  if (error instanceof Error) {
    if (error.name === 'AbortError') return 'abort';
    if (error.message.includes('timeout')) return 'timeout';
    if (error.message.includes('network') || error.message.includes('fetch')) return 'network';
  }

  if (response) {
    if (response.status >= 500) return 'server';
    if (response.status >= 400) return 'network';
  }

  return 'unknown';
}

/**
 * Get user-friendly error message in Arabic
 */
export function getErrorMessage(error: unknown, context?: string): string {
  if (error instanceof Error) {
    const fetchError = error as FetchError;

    switch (fetchError.type) {
      case 'timeout':
        return `انتهت مهلة الاتصال${context ? ` أثناء ${context}` : ''}. يرجى المحاولة مرة أخرى.`;
      case 'network':
        return `خطأ في الاتصال بالشبكة. تحقق من اتصال الإنترنت وحاول مرة أخرى.`;
      case 'abort':
        return `تم إلغاء الطلب.`;
      case 'server':
        return `خطأ في الخادم (${fetchError.status || 'غير معروف'}). يرجى المحاولة لاحقاً.`;
      case 'parse':
        return `خطأ في قراءة البيانات. قد تكون البيانات غير صالحة.`;
      default:
        return error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    }
  }

  return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
}

/**
 * Enhanced fetch with retry logic, timeout, and error handling
 */
export async function fetchWithRetry<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<{ data: T; response: Response }> {
  const {
    timeout = 10000,
    retries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  let lastError: FetchError | null = null;
  let retryCount = 0;

  while (retryCount <= retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw createFetchError(
          `HTTP ${response.status}: ${response.statusText}`,
          getErrorType(null, response),
          { status: response.status, statusText: response.statusText }
        );
      }

      // Try to parse JSON
      try {
        const data = await response.json() as T;
        return { data, response };
      } catch {
        throw createFetchError(
          'Failed to parse response as JSON',
          'parse'
        );
      }

    } catch (error) {
      clearTimeout(timeoutId);

      const errorType = getErrorType(error);
      lastError = createFetchError(
        error instanceof Error ? error.message : 'Unknown error',
        errorType,
        { retryCount }
      ) as FetchError;

      // Don't retry on abort or client errors (4xx)
      if (errorType === 'abort' || (lastError.status && lastError.status < 500)) {
        throw lastError;
      }

      // Retry with exponential backoff
      if (retryCount < retries) {
        const delay = retryDelay * Math.pow(2, retryCount);
        console.warn(`Retry ${retryCount + 1}/${retries} after ${delay}ms for ${url}`);
        await sleep(delay);
      }

      retryCount++;
    }
  }

  throw lastError;
}

/**
 * Simple fetch wrapper with error handling
 */
export async function safeFetch<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const { data } = await fetchWithRetry<T>(url, options);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Fetch with fallback data
 */
export async function fetchWithFallback<T>(
  url: string,
  fallbackData: T,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const { data } = await fetchWithRetry<T>(url, options);
    return data;
  } catch (error) {
    console.warn(`Using fallback data for ${url}:`, error);
    return fallbackData;
  }
}
