import { useCallback, useMemo, useRef, useState } from 'react';
import type {
  TourismPlace,
  TourismSearchMeta,
  TourismSearchParams,
} from '../apis/tourism/type';
import {
  createApiRequestError,
  normalizeApiRequestError,
} from '../utils/apiError';
import type { ApiRequestError } from '../utils/apiError';
import type {
  ApiDemoScenarioId,
  ApiDemoServiceError,
  ApiRequestPhase,
} from '../types/dashboard';
import { useTourismSearchQuery } from '../query/apiTest/useTourismSearchQuery';

interface TourismSearchState {
  keyword: string;
  searchVersion: number;
  failureTestCase?: TourismSearchParams['failureTestCase'];
}

interface TourismDemoState {
  keyword: string;
  scenario: NonNetworkSyntheticDemoScenarioId;
  requestId: number;
  startedAt: string;
  completedAt: string;
  latencyMs: number;
}

interface UseTourismSearchOptions {
  pageSize?: number;
  demoScenario?: ApiDemoScenarioId;
}

interface RunSearchOptions {
  demoScenario?: ApiDemoScenarioId;
  serviceError?: ApiDemoServiceError;
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
  runSearch: (keyword: string, options?: RunSearchOptions) => void;
  loadMore: () => void;
}

const INITIAL_PAGE = 0;

type NonNetworkSyntheticDemoScenarioId = Exclude<
  ApiDemoScenarioId,
  'live' | 'empty' | 'serviceError'
>;

const demoScenarioLatencyMs: Record<NonNetworkSyntheticDemoScenarioId, number> = {
  networkError: 312,
  timeout: 5000,
};

const isSyntheticDemoScenario = (
  scenario: ApiDemoScenarioId,
): scenario is NonNetworkSyntheticDemoScenarioId =>
  scenario === 'networkError' || scenario === 'timeout';

const createDemoScenarioError = (
  scenario: NonNetworkSyntheticDemoScenarioId,
) => {
  if (scenario === 'timeout') {
    return createApiRequestError({
      message:
        'The tourism search request exceeded the expected response time.',
      code: 'API_TIMEOUT',
      statusCode: 408,
    });
  }

  return createApiRequestError({
    message:
      'The network request could not reach the tourism API endpoint.',
    code: 'API_NETWORK_ERROR',
    statusCode: 503,
  });
};

export const useTourismSearch = ({
  pageSize = 6,
  demoScenario = 'live',
}: UseTourismSearchOptions = {}): UseTourismSearchResult => {
  const requestSequenceRef = useRef(0);
  const [searchState, setSearchState] = useState<TourismSearchState>({
    keyword: '',
    searchVersion: 0,
  });
  const [demoState, setDemoState] = useState<TourismDemoState | null>(null);
  const isSyntheticScenario = isSyntheticDemoScenario(demoScenario);

  const searchQuery = useTourismSearchQuery({
    keyword: searchState.keyword,
    pageSize,
    searchVersion: searchState.searchVersion,
    requestSequenceRef,
    enabled: !isSyntheticScenario,
    failureTestCase: searchState.failureTestCase,
  });

  const items = useMemo(
    () =>
      isSyntheticScenario
        ? []
        : searchQuery.data?.pages.flatMap((page) => page.data.items) ?? [],
    [isSyntheticScenario, searchQuery.data],
  );
  const latestPage = searchQuery.data?.pages.at(-1);
  const demoError =
    demoState
      ? createDemoScenarioError(demoState.scenario)
      : null;
  const total = isSyntheticScenario ? 0 : latestPage?.data.total ?? 0;
  const page = isSyntheticScenario
    ? demoState
      ? 1
      : INITIAL_PAGE
    : latestPage?.data.page ?? INITIAL_PAGE;
  const hasNextPage = isSyntheticScenario ? false : searchQuery.hasNextPage;
  const error = isSyntheticScenario
    ? demoError
    : searchQuery.error
      ? normalizeApiRequestError(searchQuery.error)
      : null;
  const meta: TourismSearchMeta | null = isSyntheticScenario
    ? demoState
      ? {
          requestId: demoState.requestId,
          keyword: demoState.keyword,
          page: 1,
          pageSize,
          startedAt: demoState.startedAt,
          completedAt: demoState.completedAt,
          latencyMs: demoState.latencyMs,
        }
      : null
    : latestPage
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
    if (isSyntheticScenario) {
      if (!demoState) {
        return 'idle';
      }

      return 'error';
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

  const runSearch = useCallback((keyword: string, options?: RunSearchOptions) => {
    const trimmedKeyword = keyword.trim();
    const nextScenario = options?.demoScenario ?? demoScenario;

    if (!trimmedKeyword) {
      setSearchState({
        keyword: '',
        searchVersion: 0,
        failureTestCase: undefined,
      });
      setDemoState(null);
      return;
    }

    if (isSyntheticDemoScenario(nextScenario)) {
      requestSequenceRef.current += 1;

      const startedDate = new Date();
      const latencyMs = demoScenarioLatencyMs[nextScenario];
      const completedDate = new Date(startedDate.getTime() + latencyMs);

      setSearchState((current) => ({
        keyword: trimmedKeyword,
        searchVersion: current.searchVersion + 1,
        failureTestCase: undefined,
      }));
      setDemoState({
        keyword: trimmedKeyword,
        scenario: nextScenario,
        requestId: requestSequenceRef.current,
        startedAt: startedDate.toISOString(),
        completedAt: completedDate.toISOString(),
        latencyMs,
      });
      return;
    }

    setSearchState((current) => ({
      keyword: trimmedKeyword,
      searchVersion: current.searchVersion + 1,
      failureTestCase:
        nextScenario === 'serviceError'
          ? options?.serviceError?.testCase
          : undefined,
    }));
    setDemoState(null);
  }, [demoScenario]);

  const loadMore = useCallback(() => {
    if (isSyntheticScenario || searchQuery.isFetching || !searchQuery.hasNextPage) {
      return;
    }

    void searchQuery.fetchNextPage();
  }, [isSyntheticScenario, searchQuery]);

  return {
    keyword: searchState.keyword,
    items,
    total,
    page,
    hasNextPage,
    phase,
    error,
    meta,
    isLoading: isSyntheticScenario ? false : searchQuery.isFetching,
    isLoadingMore: isSyntheticScenario ? false : searchQuery.isFetchingNextPage,
    runSearch,
    loadMore,
  };
};
