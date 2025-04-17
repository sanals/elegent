import { useEffect, useMemo } from 'react';
import { ApiResponse } from '../types/api-responses';
import { Page } from '../types/common.types';
import { useApiRequest } from './useApiRequest';

/**
 * Return type for the usePagedApiRequest hook
 */
export interface UsePagedApiRequestReturn<T, P extends any[]> {
  items: T[];
  pagination: {
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    isFirst: boolean;
    isLast: boolean;
  };
  loading: boolean;
  error: string | null;
  refetch: (...params: P) => Promise<ApiResponse<Page<T>> | null>;
}

/**
 * Custom hook for handling paginated API requests
 * Simplifies access to paged data by providing direct access to items and pagination info
 *
 * @param requestFn - API function that returns a paginated response
 * @param initialFetch - Whether to fetch data on mount (default: true)
 * @returns Object with items, pagination info, loading state, error state, and refetch function
 */
export function usePagedApiRequest<T, P extends any[]>(
  requestFn: (...args: P) => Promise<ApiResponse<Page<T>>>,
  initialFetch = true
): UsePagedApiRequestReturn<T, P> {
  const { data, loading, error, execute } = useApiRequest<Page<T>, P>(requestFn, false);

  // Perform initial fetch if requested
  useEffect(() => {
    if (initialFetch) {
      console.log('usePagedApiRequest: Triggering initial fetch');
      // Need to use any to bypass TypeScript's type checking for the execute function
      // since we're calling it with no parameters on initialization
      (execute as any)();
    }
  }, [execute, initialFetch]);

  // Extract items from page content
  const items = useMemo(() => data?.content || [], [data]);

  // Extract pagination info
  const pagination = useMemo(
    () => ({
      totalPages: data?.totalPages || 0,
      totalElements: data?.totalElements || 0,
      size: data?.size || 0,
      number: data?.number || 0,
      isFirst: data?.first || true,
      isLast: data?.last || true,
    }),
    [data]
  );

  return {
    items,
    pagination,
    loading,
    error,
    refetch: execute,
  };
}
