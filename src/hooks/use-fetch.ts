/**
 * Custom hook for data fetching with retry and error handling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getErrorMessage, fetchWithRetry, type FetchOptions } from '@/lib/fetch-utils';

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  refetch: () => void;
}

export interface UseFetchOptions extends FetchOptions {
  enabled?: boolean;
  fallbackData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for fetching data with built-in error handling
 */
export function useFetch<T>(
  url: string | null,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const {
    enabled = true,
    fallbackData,
    onSuccess,
    onError,
    ...fetchOptions
  } = options;

  const [data, setData] = useState<T | null>(fallbackData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use ref to avoid stale closures
  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;

    mountedRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const { data: result } = await fetchWithRetry<T>(url, fetchOptions);

      if (mountedRef.current) {
        setData(result);
        retryCountRef.current = 0;
        onSuccess?.(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);

        if (fallbackData) {
          setData(fallbackData);
        }

        onError?.(errorMessage);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [url, enabled, fetchOptions, fallbackData, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  // Manual retry
  const retry = useCallback(() => {
    retryCountRef.current++;
    fetchData();
  }, [fetchData]);

  // Alias for retry
  const refetch = retry;

  return { data, loading, error, retry, refetch };
}

/**
 * Hook for polling data at intervals
 */
export function usePolling<T>(
  url: string | null,
  intervalMs: number = 60000,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const result = useFetch<T>(url, options);

  useEffect(() => {
    if (!url || !options.enabled) return;

    const intervalId = setInterval(() => {
      result.refetch();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [url, intervalMs, options.enabled, result]);

  return result;
}

/**
 * Hook for prayer times with automatic fallback
 */
export function usePrayerTimes(city: string = 'sanaa') {
  const defaultData = {
    city: 'صنعاء',
    date: { gregorian: '', hijri: '' },
    prayers: [
      { key: 'fajr', name: 'الفجر', time: '05:00', timeFormatted: '5:00 ص' },
      { key: 'dhuhr', name: 'الظهر', time: '12:15', timeFormatted: '12:15 م' },
      { key: 'asr', name: 'العصر', time: '15:36', timeFormatted: '3:36 م' },
      { key: 'maghrib', name: 'المغرب', time: '18:12', timeFormatted: '6:12 م' },
      { key: 'isha', name: 'العشاء', time: '19:21', timeFormatted: '7:21 م' },
    ],
    sunrise: '6:18 ص',
    method: 'أم القرى',
  };

  return useFetch(`/api/prayer-times?city=${city}`, {
    fallbackData: defaultData,
    timeout: 10000,
    retries: 2,
  });
}
