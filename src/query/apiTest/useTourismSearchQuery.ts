import { useInfiniteQuery } from '@tanstack/react-query';
import type { MutableRefObject } from 'react';
import { getTourismKeywordSearch } from '../../apis/tourism/tourism';
import type {
  TourismSearchParams,
  TourismSearchResponse,
} from '../../apis/tourism/type';
import { configDefaults } from '../config';

export const tourismSearchQueryKey = (
  keyword: string,
  pageSize: number,
  searchVersion: number,
  failureTestCase: TourismSearchParams['failureTestCase'],
) =>
  [
    'tourismSearch',
    keyword,
    pageSize,
    searchVersion,
    failureTestCase ?? 'none',
  ] as const;

export const useTourismSearchQuery = ({
  keyword,
  pageSize,
  searchVersion,
  requestSequenceRef,
  enabled = true,
  failureTestCase,
}: {
  keyword: string;
  pageSize: number;
  searchVersion: number;
  requestSequenceRef: MutableRefObject<number>;
  enabled?: boolean;
  failureTestCase?: TourismSearchParams['failureTestCase'];
}) =>
  useInfiniteQuery<TourismSearchResponse, Error>({
    queryKey: tourismSearchQueryKey(
      keyword,
      pageSize,
      searchVersion,
      failureTestCase,
    ),
    queryFn: ({ pageParam, signal }) => {
      requestSequenceRef.current += 1;

      return getTourismKeywordSearch({
        keyword,
        page: typeof pageParam === 'number' ? pageParam : 1,
        pageSize,
        requestId: requestSequenceRef.current,
        signal,
        failureTestCase,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNextPage ? lastPage.data.page + 1 : undefined,
    enabled: enabled && keyword.length > 0,
    ...configDefaults,
  });
