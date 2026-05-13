import { useInfiniteQuery } from '@tanstack/react-query';
import type { MutableRefObject } from 'react';
import { getTourismKeywordSearch } from '../../apis/tourism/tourism';
import type { TourismSearchResponse } from '../../apis/tourism/type';
import { configDefaults } from '../config';

export const tourismSearchQueryKey = (
  keyword: string,
  pageSize: number,
  searchVersion: number,
) => ['tourismSearch', keyword, pageSize, searchVersion] as const;

export const useTourismSearchQuery = ({
  keyword,
  pageSize,
  searchVersion,
  requestSequenceRef,
}: {
  keyword: string;
  pageSize: number;
  searchVersion: number;
  requestSequenceRef: MutableRefObject<number>;
}) =>
  useInfiniteQuery<TourismSearchResponse, Error>({
    queryKey: tourismSearchQueryKey(keyword, pageSize, searchVersion),
    queryFn: ({ pageParam, signal }) => {
      requestSequenceRef.current += 1;

      return getTourismKeywordSearch({
        keyword,
        page: typeof pageParam === 'number' ? pageParam : 1,
        pageSize,
        requestId: requestSequenceRef.current,
        signal,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNextPage ? lastPage.data.page + 1 : undefined,
    enabled: keyword.length > 0,
    ...configDefaults,
  });
