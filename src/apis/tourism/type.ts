import type { ApiResponse, PaginatedResponse } from '../../types/dashboard';
import type { TourismClassificationSystem } from '../../assests/data/tourismContentTypeCodes';

export interface TourismPlace {
  id: string;
  title: string;
  address: string;
  addressDetail: string;
  imageUrl?: string;
  contentTypeId: string;
  contentTypeName: string;
  contentTypeMultilingualCode: string;
  modifiedAt: string;
  regionCode: string;
  legalRegionCode: string;
  legalDistrictCode: string;
  categoryCode: string;
  classification: TourismClassificationSystem | null;
  classificationPath: string;
  lclsSystm1: string;
  lclsSystm2: string;
  lclsSystm3: string;
  mapX?: number;
  mapY?: number;
}

export interface TourismSearchParams {
  keyword: string;
  page: number;
  pageSize: number;
  requestId: number;
  signal?: AbortSignal;
}

export interface TourismSearchMeta {
  requestId: number;
  keyword: string;
  page: number;
  pageSize: number;
  startedAt: string;
  completedAt?: string;
  latencyMs?: number;
}

export type TourismSearchResponse = ApiResponse<
  PaginatedResponse<TourismPlace>
> & TourismSearchMeta;

export interface TourismApiHeader {
  resultCode?: string;
  resultMsg?: string;
}

export interface TourismApiItem {
  contentid?: string;
  title?: string;
  addr1?: string;
  addr2?: string;
  firstimage?: string;
  contenttypeid?: string;
  modifiedtime?: string;
  areacode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  lDongRegnCd?: string;
  lDongSignguCd?: string;
  lclsSystm1?: string;
  lclsSystm2?: string;
  lclsSystm3?: string;
  mapx?: string;
  mapy?: string;
}

export interface TourismApiBody {
  items?: {
    item?: TourismApiItem[] | TourismApiItem;
  };
  pageNo?: number | string;
  numOfRows?: number | string;
  totalCount?: number | string;
}

export interface TourismApiResponse {
  response?: {
    header?: TourismApiHeader;
    body?: TourismApiBody;
  };
}
