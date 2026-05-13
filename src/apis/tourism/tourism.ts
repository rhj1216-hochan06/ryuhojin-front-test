import axios from '../../utils/axios';
import {
  createAbortRequestError,
  createApiRequestError,
  isApiRequestError,
} from '../../utils/apiError';
import type {
  TourismApiItem,
  TourismApiResponse,
  TourismPlace,
  TourismSearchParams,
  TourismSearchResponse,
} from './type';

const baseUrl = 'https://apis.data.go.kr/B551011/KorService2';
const path = '/searchKeyword2';
const serviceKey = process.env.REACT_APP_DATA_GO_KR_SERVICE_KEY ?? '';

const missingKeyError = createApiRequestError({
  message: 'REACT_APP_DATA_GO_KR_SERVICE_KEY is not configured.',
  code: 'MISSING_DATA_GO_KR_SERVICE_KEY',
  statusCode: 401,
  retryable: false,
});

const toArray = (item: TourismApiItem[] | TourismApiItem | undefined) => {
  if (!item) {
    return [];
  }

  return Array.isArray(item) ? item : [item];
};

const toNumber = (value: string | number | undefined) => {
  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeModifiedAt = (value: string | undefined) => {
  if (!value || value.length < 8) {
    return new Date().toISOString();
  }

  const year = value.slice(0, 4);
  const month = value.slice(4, 6);
  const day = value.slice(6, 8);
  const hour = value.slice(8, 10) || '00';
  const minute = value.slice(10, 12) || '00';
  const second = value.slice(12, 14) || '00';

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`)
    .toISOString();
};

const normalizeTourismPlace = (item: TourismApiItem): TourismPlace => ({
  id: item.contentid ?? `${item.title ?? 'tourism'}-${item.modifiedtime ?? 'unknown'}`,
  title: item.title ?? 'Untitled tourism item',
  address: item.addr1 ?? '',
  imageUrl: item.firstimage || undefined,
  contentTypeId: item.contenttypeid ?? '-',
  modifiedAt: normalizeModifiedAt(item.modifiedtime),
  regionCode: item.areacode ?? '-',
  categoryCode: item.cat1 ?? '-',
  mapX: toNumber(item.mapx),
  mapY: toNumber(item.mapy),
});

/**
 * @description 한국관광공사 국문 관광정보 키워드 검색
 * @see https://www.data.go.kr/data/15101578/openapi.do
 */
export const getTourismKeywordSearch = async ({
  keyword,
  page,
  pageSize,
  requestId,
  signal,
}: TourismSearchParams): Promise<TourismSearchResponse> => {
  if (!serviceKey) {
    throw missingKeyError;
  }

  if (signal?.aborted) {
    throw createAbortRequestError('The tourism search request was canceled before it completed.');
  }

  const startedAt = new Date().toISOString();
  const startedTime = Date.now();
  const requestUrl = `${baseUrl}${path}?serviceKey=${serviceKey}`;

  try {
    const response = await axios.get<TourismApiResponse | string>(requestUrl, {
      params: {
        numOfRows: pageSize,
        pageNo: page,
        MobileOS: 'WEB',
        MobileApp: 'Portfolio',
        _type: 'json',
        arrange: 'Q',
        keyword,
      },
    });
    const payload =
      typeof response.data === 'string'
        ? (JSON.parse(response.data) as TourismApiResponse)
        : response.data;
    const header = payload.response?.header;
    const body = payload.response?.body;

    if (header?.resultCode && header.resultCode !== '0000') {
      throw createApiRequestError({
        message: header.resultMsg ?? 'Public data API returned an error result.',
        code: `PUBLIC_DATA_${header.resultCode}`,
        statusCode: 400,
      });
    }

    const items = toArray(body?.items?.item).map(normalizeTourismPlace);
    const total = toNumber(body?.totalCount) ?? items.length;
    const responsePage = toNumber(body?.pageNo) ?? page;
    const responsePageSize = toNumber(body?.numOfRows) ?? pageSize;
    const completedAt = new Date().toISOString();

    return {
      status: 'success',
      data: {
        items,
        page: responsePage,
        pageSize: responsePageSize,
        total,
        hasNextPage: responsePage * responsePageSize < total,
      },
      generatedAt: completedAt,
      latencyMs: Date.now() - startedTime,
      requestId,
      keyword,
      page: responsePage,
      pageSize: responsePageSize,
      startedAt,
      completedAt,
    };
  } catch (error: unknown) {
    if (isApiRequestError(error)) {
      throw error;
    }

    throw error;
  }
};
