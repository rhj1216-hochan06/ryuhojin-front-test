import axios from '../../utils/axios';
import {
  createAbortRequestError,
  createApiRequestError,
  isApiRequestError,
} from '../../utils/apiError';
import {
  tourismApiBase,
  tourismApiDefaultRequestParams,
  tourismApiOperations,
} from '../../assests/data/tourismApiManual';
import {
  getTourismClassificationPath,
  getTourismClassificationSystem,
  getTourismContentTypeCode,
} from '../../assests/data/tourismContentTypeCodes';
import type {
  TourismCommonDetailParams,
  TourismCommonDetailResponse,
  TourismApiItem,
  TourismApiResponse,
  TourismHomepageLink,
  TourismPlace,
  TourismPlaceDetail,
  TourismSearchParams,
  TourismSearchResponse,
} from './type';

const baseUrl = tourismApiBase.baseUrl;
const keywordSearchPath = tourismApiOperations.searchKeyword2.path;
const detailCommonPath = tourismApiOperations.detailCommon2.path;
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

const normalizeApiDateTime = (value: string | undefined) => {
  if (!value || value.length < 8) {
    return undefined;
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

const normalizeModifiedAt = (value: string | undefined) => {
  if (!value || value.length < 8) {
    return new Date().toISOString();
  }

  return normalizeApiDateTime(value) ?? new Date().toISOString();
};

const decodeHtmlEntity = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const stripHtml = (value: string) =>
  decodeHtmlEntity(value.replace(/<[^>]*>/g, ' ').replace(/[ \t]+/g, ' ').trim());

const trimUrl = (value: string) => value.replace(/[.,)]+$/, '');

const getPlainHomepageLinks = (homepage: string): TourismHomepageLink[] => {
  const homepageLinks: TourismHomepageLink[] = [];
  const plainHomepage = stripHtml(homepage);
  const protocolPattern = /https?:\/\//g;
  let cursor = 0;
  let match = protocolPattern.exec(plainHomepage);

  while (match) {
    const urlStart = match.index;
    const label = plainHomepage.slice(cursor, urlStart).replace(/\s+/g, ' ').trim();
    const nextWhitespace = plainHomepage.slice(urlStart).search(/\s/);
    const tokenEnd =
      nextWhitespace === -1 ? plainHomepage.length : urlStart + nextWhitespace;
    const rawUrl = plainHomepage.slice(urlStart, tokenEnd);
    const appendedKoreanLabelIndex = rawUrl.search(/[가-힣]/);
    const urlEnd =
      appendedKoreanLabelIndex === -1
        ? tokenEnd
        : urlStart + appendedKoreanLabelIndex;
    const url = trimUrl(plainHomepage.slice(urlStart, urlEnd));

    if (url) {
      homepageLinks.push({
        label: decodeHtmlEntity(label) || url,
        url: decodeHtmlEntity(url),
      });
    }

    cursor = urlEnd;
    protocolPattern.lastIndex = urlEnd;
    match = protocolPattern.exec(plainHomepage);
  }

  return homepageLinks;
};

const normalizeHomepage = (homepage: string | undefined) => {
  if (!homepage) {
    return {
      homepageHtml: '',
      homepageText: '',
      homepageLinks: [],
    };
  }

  const homepageLinks: TourismHomepageLink[] = [];
  const anchorPattern = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let anchorMatch = anchorPattern.exec(homepage);

  while (anchorMatch) {
    const url = trimUrl(decodeHtmlEntity(anchorMatch[1]));
    const label = stripHtml(anchorMatch[2]) || url;

    homepageLinks.push({ label, url });
    anchorMatch = anchorPattern.exec(homepage);
  }

  if (homepageLinks.length === 0) {
    homepageLinks.push(...getPlainHomepageLinks(homepage));
  }

  return {
    homepageHtml: homepage,
    homepageText: stripHtml(homepage),
    homepageLinks,
  };
};

const createNaverMapUrl = (mapX?: number, mapY?: number) => {
  if (typeof mapX !== 'number' || typeof mapY !== 'number') {
    return undefined;
  }

  return `https://map.naver.com/p/search/${encodeURIComponent(`${mapY},${mapX}`)}`;
};

const normalizeTourismPlace = (item: TourismApiItem): TourismPlace => {
  const classification = getTourismClassificationSystem({
    lclsSystm1: item.lclsSystm1,
    lclsSystm2: item.lclsSystm2,
    lclsSystm3: item.lclsSystm3,
  });
  const contentType = getTourismContentTypeCode(
    item.contenttypeid ?? classification?.contentTypeId,
  );
  const mapX = toNumber(item.mapx);
  const mapY = toNumber(item.mapy);

  return {
    id: item.contentid ?? `${item.title ?? 'tourism'}-${item.modifiedtime ?? 'unknown'}`,
    title: item.title ?? 'Untitled tourism item',
    address: item.addr1 ?? '',
    addressDetail: item.addr2 ?? '',
    imageUrl: item.firstimage || undefined,
    contentTypeId: contentType.contentTypeId,
    contentTypeName: contentType.name,
    contentTypeMultilingualCode: contentType.multilingualCode,
    modifiedAt: normalizeModifiedAt(item.modifiedtime),
    regionCode: item.areacode ?? '-',
    legalRegionCode: item.lDongRegnCd ?? '-',
    legalDistrictCode: item.lDongSignguCd ?? '-',
    categoryCode: item.lclsSystm3 ?? item.cat3 ?? item.cat2 ?? item.cat1 ?? '-',
    classification,
    classificationPath: getTourismClassificationPath(classification),
    lclsSystm1: item.lclsSystm1 ?? '-',
    lclsSystm2: item.lclsSystm2 ?? '-',
    lclsSystm3: item.lclsSystm3 ?? '-',
    mapX,
    mapY,
    naverMapUrl: createNaverMapUrl(mapX, mapY),
  };
};

const normalizeTourismPlaceDetail = (item: TourismApiItem): TourismPlaceDetail => {
  const homepage = normalizeHomepage(item.homepage);

  return {
    ...normalizeTourismPlace(item),
    createdAt: normalizeApiDateTime(item.createdtime),
    phone: item.tel ?? '',
    phoneName: item.telname ?? '',
    homepageHtml: homepage.homepageHtml,
    homepageText: homepage.homepageText,
    homepageLinks: homepage.homepageLinks,
    thumbnailImageUrl: item.firstimage2 || undefined,
    zipCode: item.zipcode ?? '-',
    overview: item.overview ?? '',
  };
};

const parseTourismApiResponse = (data: TourismApiResponse | string) =>
  typeof data === 'string' ? (JSON.parse(data) as TourismApiResponse) : data;

const assertTourismApiSuccess = (payload: TourismApiResponse) => {
  const header = payload.response?.header;

  if (header?.resultCode && header.resultCode !== '0000') {
    throw createApiRequestError({
      message: header.resultMsg ?? 'Public data API returned an error result.',
      code: `PUBLIC_DATA_${header.resultCode}`,
      statusCode: 400,
    });
  }
};

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
  const requestUrl = `${baseUrl}${keywordSearchPath}?serviceKey=${serviceKey}`;

  try {
    const response = await axios.get<TourismApiResponse | string>(requestUrl, {
      signal,
      params: {
        numOfRows: pageSize,
        pageNo: page,
        MobileOS: tourismApiDefaultRequestParams.MobileOS,
        MobileApp: tourismApiDefaultRequestParams.MobileApp,
        _type: tourismApiDefaultRequestParams._type,
        arrange: tourismApiDefaultRequestParams.arrangeWithImage,
        keyword,
      },
    });
    const payload = parseTourismApiResponse(response.data);
    const body = payload.response?.body;

    assertTourismApiSuccess(payload);

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

/**
 * @description 한국관광공사 국문 관광정보 공통정보 상세 조회
 * @see https://www.data.go.kr/data/15101578/openapi.do
 */
export const getTourismCommonDetail = async ({
  contentId,
  signal,
}: TourismCommonDetailParams): Promise<TourismCommonDetailResponse> => {
  if (!serviceKey) {
    throw missingKeyError;
  }

  if (signal?.aborted) {
    throw createAbortRequestError(
      'The tourism detail request was canceled before it completed.',
    );
  }

  const requestUrl = `${baseUrl}${detailCommonPath}?serviceKey=${serviceKey}`;
  const startedTime = Date.now();

  try {
    const response = await axios.get<TourismApiResponse | string>(requestUrl, {
      signal,
      params: {
        numOfRows: 10,
        pageNo: 1,
        MobileOS: tourismApiDefaultRequestParams.MobileOS,
        MobileApp: tourismApiDefaultRequestParams.MobileApp,
        _type: tourismApiDefaultRequestParams._type,
        contentId,
      },
    });
    const payload = parseTourismApiResponse(response.data);
    const body = payload.response?.body;

    assertTourismApiSuccess(payload);

    const [item] = toArray(body?.items?.item);

    if (!item) {
      throw createApiRequestError({
        message: 'Public data API returned an empty detail response.',
        code: 'PUBLIC_DATA_EMPTY_DETAIL',
        statusCode: 404,
      });
    }

    return {
      status: 'success',
      data: normalizeTourismPlaceDetail(item),
      generatedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedTime,
    };
  } catch (error: unknown) {
    if (isApiRequestError(error)) {
      throw error;
    }

    throw error;
  }
};
