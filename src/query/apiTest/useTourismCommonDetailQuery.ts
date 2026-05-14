import { useQuery } from '@tanstack/react-query';
import { getTourismCommonDetail } from '../../apis/tourism/tourism';
import type { TourismCommonDetailResponse } from '../../apis/tourism/type';
import { configDefaults } from '../config';

export const tourismCommonDetailQueryKey = (contentId: string | undefined) =>
  ['tourismCommonDetail', contentId] as const;

export const useTourismCommonDetailQuery = (contentId: string | undefined) =>
  useQuery<TourismCommonDetailResponse, Error>({
    queryKey: tourismCommonDetailQueryKey(contentId),
    queryFn: ({ signal }) =>
      getTourismCommonDetail({
        contentId: contentId ?? '',
        signal,
      }),
    enabled: Boolean(contentId),
    ...configDefaults,
  });
