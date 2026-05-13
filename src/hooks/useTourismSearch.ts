import { useCallback, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { TourismPlace, TourismSearchMeta } from '../apis/tourism/type';
import { normalizeApiRequestError } from '../utils/apiError';
import type { ApiRequestError } from '../utils/apiError';
import type { ApiRequestPhase } from '../types/dashboard';
import {
  tourismSearchQueryKey,
  useTourismSearchQuery,
} from '../query/apiTest/useTourismSearchQuery';

interface TourismSearchState {
  keyword: string;
  searchVersion: number;
  isCanceled: boolean;
}

interface UseTourismSearchResult {
  keyword: string;
  items: TourismPlace[];
  total: number;
  page: number;
  hasNextPage: boolean;
  phase: ApiRequestPhase;
  error: ApiRequestError | null;
  meta: TourismSearchMeta | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  runSearch: (keyword: string) => void;
  retry: () => void;
  cancelRequest: () => void;
  loadMore: () => void;
}

const INITIAL_PAGE = 0;

export const useTourismSearch = (pageSize = 6): UseTourismSearchResult => {
  const queryClient = useQueryClient();
  const requestSequenceRef = useRef(0);
  const [searchState, setSearchState] = useState<TourismSearchState>({
    keyword: '',
    searchVersion: 0,
    isCanceled: false,
  });

  const searchQuery = useTourismSearchQuery({
    keyword: searchState.keyword,
    pageSize,
    searchVersion: searchState.searchVersion,
    requestSequenceRef,
  });
  const items = useMemo(
    () => searchQuery.data?.pages.flatMap((page) => page.data.items) ?? [],
    [searchQuery.data],
  );
  const latestPage = searchQuery.data?.pages.at(-1);
  const total = latestPage?.data.total ?? 0;
  const page = latestPage?.data.page ?? INITIAL_PAGE;
  const hasNextPage = searchQuery.hasNextPage;
  const error = searchQuery.error
    ? normalizeApiRequestError(searchQuery.error)
    : null;
  const meta: TourismSearchMeta | null = latestPage
    ? {
        requestId: latestPage.requestId,
        keyword: latestPage.keyword,
        page: latestPage.page,
        pageSize: latestPage.pageSize,
        startedAt: latestPage.startedAt,
        completedAt: latestPage.completedAt,
        latencyMs: latestPage.latencyMs,
      }
    : null;

  const phase: ApiRequestPhase = (() => {
    if (searchState.isCanceled) {
      return 'canceled';
    }

    if (searchQuery.isFetching && !searchQuery.isFetchingNextPage) {
      return 'loading';
    }

    if (error) {
      return error.name === 'AbortError' ? 'canceled' : 'error';
    }

    if (!searchState.keyword) {
      return 'idle';
    }

    if (items.length === 0 && searchQuery.isSuccess) {
      return 'empty';
    }

    if (items.length > 0) {
      return 'success';
    }

    return 'idle';
  })();

  const runSearch = useCallback((keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      setSearchState({
        keyword: '',
        searchVersion: 0,
        isCanceled: false,
      });
      return;
    }

    setSearchState((current) => ({
      keyword: trimmedKeyword,
      searchVersion: current.searchVersion + 1,
      isCanceled: false,
    }));
  }, []);

  const retry = useCallback(() => {
    setSearchState((current) => {
      if (!current.keyword) {
        return current;
      }

      return {
        ...current,
        searchVersion: current.searchVersion + 1,
        isCanceled: false,
      };
    });
  }, []);

  const cancelRequest = useCallback(() => {
    if (!searchState.keyword) {
      return;
    }

    void queryClient.cancelQueries({
      queryKey: tourismSearchQueryKey(
        searchState.keyword,
        pageSize,
        searchState.searchVersion,
      ),
    });
    setSearchState((current) => ({
      ...current,
      isCanceled: true,
    }));
  }, [
    pageSize,
    queryClient,
    searchState.keyword,
    searchState.searchVersion,
  ]);

  const loadMore = useCallback(() => {
    if (
      searchQuery.isFetching ||
      !searchQuery.hasNextPage ||
      searchState.isCanceled
    ) {
      return;
    }

    void searchQuery.fetchNextPage();
  }, [searchQuery, searchState.isCanceled]);

  return {
    keyword: searchState.keyword,
    items,
    total,
    page,
    hasNextPage,
    phase,
    error,
    meta,
    isLoading: searchQuery.isFetching,
    isLoadingMore: searchQuery.isFetchingNextPage,
    runSearch,
    retry,
    cancelRequest,
    loadMore,
  };
};
