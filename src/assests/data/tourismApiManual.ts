//한국관광공사_개방데이터_활용매뉴얼(국문)_v4.4.docx 문서를 ai를 활용하여 ts화를 진행하였습니다.
export type TourismApiOperationId =
  | 'areaBasedList2'
  | 'locationBasedList2'
  | 'searchKeyword2'
  | 'searchFestival2'
  | 'searchStay2'
  | 'detailCommon2'
  | 'detailIntro2'
  | 'detailInfo2'
  | 'detailImage2'
  | 'areaBasedSyncList2'
  | 'detailPetTour2'
  | 'ldongCode2'
  | 'lclsSystmCode2';

export type TourismApiParameterId =
  | 'numOfRows'
  | 'pageNo'
  | 'MobileOS'
  | 'MobileApp'
  | 'serviceKey'
  | '_type'
  | 'arrange'
  | 'contentTypeId'
  | 'modifiedtime'
  | 'keyword'
  | 'mapX'
  | 'mapY'
  | 'radius'
  | 'eventStartDate'
  | 'eventEndDate'
  | 'contentId'
  | 'contentid'
  | 'imageYN'
  | 'showflag'
  | 'oldContentid'
  | 'lDongRegnCd'
  | 'lDongSignguCd'
  | 'lDongListYn'
  | 'lclsSystm1'
  | 'lclsSystm2'
  | 'lclsSystm3'
  | 'lclsSystmListYn';

export type TourismApiResponseFieldId =
  | 'resultCode'
  | 'resultMsg'
  | 'numOfRows'
  | 'pageNo'
  | 'totalCount'
  | 'addr1'
  | 'addr2'
  | 'contentid'
  | 'contenttypeid'
  | 'createdtime'
  | 'firstimage'
  | 'firstimage2'
  | 'cpyrhtDivCd'
  | 'mapx'
  | 'mapy'
  | 'mlevel'
  | 'modifiedtime'
  | 'tel'
  | 'telname'
  | 'homepage'
  | 'title'
  | 'lDongRegnCd'
  | 'lDongSignguCd'
  | 'lclsSystm1'
  | 'lclsSystm2'
  | 'lclsSystm3'
  | 'zipcode'
  | 'overview'
  | 'code'
  | 'name'
  | 'rnum'
  | 'lDongRegnNm'
  | 'lDongSignguNm'
  | 'lclsSystm1Cd'
  | 'lclsSystm1Nm'
  | 'lclsSystm2Cd'
  | 'lclsSystm2Nm'
  | 'lclsSystm3Cd'
  | 'lclsSystm3Nm';

export interface TourismApiParameter {
  id: TourismApiParameterId;
  nameKo: string;
  required: boolean;
  sample: string;
  description: string;
}

export interface TourismApiResponseField {
  id: TourismApiResponseFieldId;
  nameKo: string;
  required: boolean;
  sample: string;
  description: string;
}

export interface TourismApiOperation {
  id: TourismApiOperationId;
  order: number;
  nameKo: string;
  operationType: '조회 (목록)' | '조회(상세)';
  path: `/${TourismApiOperationId}`;
  description: string;
  requestParamIds: TourismApiParameterId[];
  responseFieldIds: TourismApiResponseFieldId[];
  portfolioUse: string;
}

export interface TourismApiResultCode {
  code: string;
  message: string;
  description: string;
}

export interface TourismApiSortOption {
  code: string;
  label: string;
  requiresImage: boolean;
  availableOnLocationSearch: boolean;
}

export const tourismApiManualSource = {
  documentName: '한국관광공사_개방데이터_활용매뉴얼(국문)_v4.4.docx',
  documentVersion: 'v4.4',
  serviceVersion: '4.0',
  sourcePath:
    'src/assests/data/한국관광공사_개방데이터_활용매뉴얼(국문)_v4.4.docx',
} as const;

export const tourismApiBase = {
  serviceId: 'KorService2',
  nameKo: '국문 관광정보 서비스',
  baseUrl: 'https://apis.data.go.kr/B551011/KorService2',
  method: 'GET',
  dataFormats: ['XML', 'JSON'],
  defaultDataFormat: 'json',
  description:
    '코드 조회 및 관광정보의 통합/상세 검색, 위치기반, 지역기반 국내 관광정보를 국문으로 제공하는 OpenAPI입니다.',
} as const;

export const tourismApiDefaultRequestParams = {
  MobileOS: 'WEB',
  MobileApp: 'individualPortfolioWebsite',
  _type: 'json',
  arrangeWithImage: 'Q',
} as const;

export const tourismApiSortOptions: TourismApiSortOption[] = [
  {
    code: 'A',
    label: '제목순',
    requiresImage: false,
    availableOnLocationSearch: true,
  },
  {
    code: 'C',
    label: '수정일순',
    requiresImage: false,
    availableOnLocationSearch: true,
  },
  {
    code: 'D',
    label: '생성일순',
    requiresImage: false,
    availableOnLocationSearch: true,
  },
  {
    code: 'E',
    label: '거리순',
    requiresImage: false,
    availableOnLocationSearch: true,
  },
  {
    code: 'O',
    label: '제목순',
    requiresImage: true,
    availableOnLocationSearch: true,
  },
  {
    code: 'Q',
    label: '수정일순',
    requiresImage: true,
    availableOnLocationSearch: true,
  },
  {
    code: 'R',
    label: '생성일순',
    requiresImage: true,
    availableOnLocationSearch: true,
  },
  {
    code: 'S',
    label: '거리순',
    requiresImage: true,
    availableOnLocationSearch: true,
  },
];

export const tourismApiRequestParameters: Record<
  TourismApiParameterId,
  TourismApiParameter
> = {
  numOfRows: {
    id: 'numOfRows',
    nameKo: '한 페이지 결과 수',
    required: false,
    sample: '10',
    description: '한 페이지 결과 수입니다.',
  },
  pageNo: {
    id: 'pageNo',
    nameKo: '페이지 번호',
    required: false,
    sample: '1',
    description: '현재 페이지 번호입니다.',
  },
  MobileOS: {
    id: 'MobileOS',
    nameKo: 'OS 구분',
    required: true,
    sample: 'ETC',
    description: 'IOS, AND, WEB, ETC 중 호출 환경을 전달합니다.',
  },
  MobileApp: {
    id: 'MobileApp',
    nameKo: '서비스명',
    required: true,
    sample: 'AppTest',
    description: '서비스별 활용 통계를 위한 앱 또는 웹 서비스명입니다.',
  },
  serviceKey: {
    id: 'serviceKey',
    nameKo: '인증키',
    required: true,
    sample: '인증키',
    description: '공공데이터포털에서 발급받은 서비스키입니다.',
  },
  _type: {
    id: '_type',
    nameKo: '응답 메시지 형식',
    required: false,
    sample: 'json',
    description: 'JSON 응답을 받을 때 json 값을 전달합니다.',
  },
  arrange: {
    id: 'arrange',
    nameKo: '정렬 구분',
    required: false,
    sample: 'C',
    description:
      'A=제목순, C=수정일순, D=생성일순입니다. O, Q, R은 대표 이미지가 있는 결과만 정렬합니다.',
  },
  contentTypeId: {
    id: 'contentTypeId',
    nameKo: '관광타입 ID',
    required: false,
    sample: '12',
    description: '관광지, 문화시설, 행사/공연/축제 등 콘텐츠 타입 코드입니다.',
  },
  modifiedtime: {
    id: 'modifiedtime',
    nameKo: '콘텐츠 수정일',
    required: false,
    sample: '20250415',
    description: '콘텐츠 수정일입니다. 형식은 YYYYMMDD입니다.',
  },
  keyword: {
    id: 'keyword',
    nameKo: '요청 키워드',
    required: true,
    sample: '시장',
    description: '검색 요청할 국문 키워드입니다. URL 호출 시 인코딩이 필요합니다.',
  },
  mapX: {
    id: 'mapX',
    nameKo: 'X좌표',
    required: true,
    sample: '126.98375',
    description: 'WGS84 경도 좌표입니다.',
  },
  mapY: {
    id: 'mapY',
    nameKo: 'Y좌표',
    required: true,
    sample: '37.563446',
    description: 'WGS84 위도 좌표입니다.',
  },
  radius: {
    id: 'radius',
    nameKo: '거리 반경',
    required: true,
    sample: '1000',
    description: '거리 반경입니다. 단위는 m이고 최대 20000m입니다.',
  },
  eventStartDate: {
    id: 'eventStartDate',
    nameKo: '행사 시작일',
    required: true,
    sample: '20260101',
    description: '행사 시작일입니다. 형식은 YYYYMMDD입니다.',
  },
  eventEndDate: {
    id: 'eventEndDate',
    nameKo: '행사 종료일',
    required: false,
    sample: '20261231',
    description: '행사 종료일입니다. 형식은 YYYYMMDD입니다.',
  },
  contentId: {
    id: 'contentId',
    nameKo: '콘텐츠 ID',
    required: true,
    sample: '126128',
    description: '관광 콘텐츠 ID입니다.',
  },
  contentid: {
    id: 'contentid',
    nameKo: '콘텐츠 ID',
    required: false,
    sample: '125534',
    description: '반려동물 동반 여행정보 조회용 콘텐츠 ID입니다.',
  },
  imageYN: {
    id: 'imageYN',
    nameKo: '이미지 조회',
    required: false,
    sample: 'Y',
    description: 'Y=콘텐츠 이미지, N=음식점 타입의 음식 메뉴 이미지입니다.',
  },
  showflag: {
    id: 'showflag',
    nameKo: '표출 여부',
    required: false,
    sample: '1',
    description: '콘텐츠 표출 여부입니다. 1=표출, 0=비표출입니다.',
  },
  oldContentid: {
    id: 'oldContentid',
    nameKo: '이전 콘텐츠 ID',
    required: false,
    sample: '',
    description: 'DB 동기화 시 이전 콘텐츠 KEY 값으로 조회하는 용도입니다.',
  },
  lDongRegnCd: {
    id: 'lDongRegnCd',
    nameKo: '법정동 시도 코드',
    required: false,
    sample: '50',
    description: '법정동 코드 조회 결과의 시도 코드입니다.',
  },
  lDongSignguCd: {
    id: 'lDongSignguCd',
    nameKo: '법정동 시군구 코드',
    required: false,
    sample: '130',
    description: '법정동 시군구 코드입니다. lDongRegnCd가 필요합니다.',
  },
  lDongListYn: {
    id: 'lDongListYn',
    nameKo: '법정동 목록조회 여부',
    required: false,
    sample: 'N',
    description: 'N=코드조회, Y=전체목록조회입니다.',
  },
  lclsSystm1: {
    id: 'lclsSystm1',
    nameKo: '분류체계 대분류',
    required: false,
    sample: 'SH',
    description: '분류체계 코드 조회 결과의 대분류 코드입니다.',
  },
  lclsSystm2: {
    id: 'lclsSystm2',
    nameKo: '분류체계 중분류',
    required: false,
    sample: 'SH06',
    description: '분류체계 중분류 코드입니다. lclsSystm1이 필요합니다.',
  },
  lclsSystm3: {
    id: 'lclsSystm3',
    nameKo: '분류체계 소분류',
    required: false,
    sample: 'SH060100',
    description:
      '분류체계 소분류 코드입니다. lclsSystm1과 lclsSystm2가 필요합니다.',
  },
  lclsSystmListYn: {
    id: 'lclsSystmListYn',
    nameKo: '분류체계 목록조회 여부',
    required: false,
    sample: 'N',
    description: 'N=코드조회, Y=전체목록조회입니다.',
  },
};

export const tourismApiResponseFields: Record<
  TourismApiResponseFieldId,
  TourismApiResponseField
> = {
  resultCode: {
    id: 'resultCode',
    nameKo: '결과 코드',
    required: true,
    sample: '0000',
    description: '응답 결과 코드입니다.',
  },
  resultMsg: {
    id: 'resultMsg',
    nameKo: '결과 메시지',
    required: true,
    sample: 'OK',
    description: '응답 결과 메시지입니다.',
  },
  numOfRows: {
    id: 'numOfRows',
    nameKo: '한 페이지 결과 수',
    required: true,
    sample: '10',
    description: '한 페이지 결과 수입니다.',
  },
  pageNo: {
    id: 'pageNo',
    nameKo: '페이지 번호',
    required: true,
    sample: '1',
    description: '현재 페이지 번호입니다.',
  },
  totalCount: {
    id: 'totalCount',
    nameKo: '전체 결과 수',
    required: true,
    sample: '25',
    description: '전체 결과 수입니다.',
  },
  addr1: {
    id: 'addr1',
    nameKo: '주소',
    required: false,
    sample: '제주특별자치도 서귀포시 천제연로188번길 12',
    description: '기본 주소입니다.',
  },
  addr2: {
    id: 'addr2',
    nameKo: '상세주소',
    required: false,
    sample: '',
    description: '상세 주소입니다.',
  },
  contentid: {
    id: 'contentid',
    nameKo: '콘텐츠 ID',
    required: true,
    sample: '132595',
    description: '관광 콘텐츠 ID입니다.',
  },
  contenttypeid: {
    id: 'contenttypeid',
    nameKo: '관광타입 ID',
    required: true,
    sample: '38',
    description: '콘텐츠 타입 ID입니다.',
  },
  createdtime: {
    id: 'createdtime',
    nameKo: '등록일',
    required: true,
    sample: '20040213090000',
    description: '콘텐츠 최초 등록일입니다.',
  },
  firstimage: {
    id: 'firstimage',
    nameKo: '대표이미지',
    required: false,
    sample: 'http://tong.visitkorea.or.kr/cms/resource/50/3477250_image2_1.jpg',
    description: '원본 대표이미지 URL입니다.',
  },
  firstimage2: {
    id: 'firstimage2',
    nameKo: '대표이미지 썸네일',
    required: false,
    sample: 'http://tong.visitkorea.or.kr/cms/resource/50/3477250_image3_1.jpg',
    description: '썸네일 대표이미지 URL입니다.',
  },
  cpyrhtDivCd: {
    id: 'cpyrhtDivCd',
    nameKo: '저작권 유형',
    required: false,
    sample: 'Type3',
    description: 'Type1 또는 Type3 공공누리 유형입니다.',
  },
  mapx: {
    id: 'mapx',
    nameKo: 'GPS X좌표',
    required: false,
    sample: '126.4242345901',
    description: 'WGS84 경도 좌표입니다.',
  },
  mapy: {
    id: 'mapy',
    nameKo: 'GPS Y좌표',
    required: false,
    sample: '33.2507951855',
    description: 'WGS84 위도 좌표입니다.',
  },
  mlevel: {
    id: 'mlevel',
    nameKo: 'Map Level',
    required: false,
    sample: '6',
    description: '지도 확대 레벨입니다.',
  },
  modifiedtime: {
    id: 'modifiedtime',
    nameKo: '콘텐츠 수정일',
    required: true,
    sample: '20250414130425',
    description: '콘텐츠 수정일입니다.',
  },
  tel: {
    id: 'tel',
    nameKo: '전화번호',
    required: false,
    sample: '064-760-2633',
    description: '전화번호입니다.',
  },
  telname: {
    id: 'telname',
    nameKo: '전화번호명',
    required: false,
    sample: '관광안내소',
    description: '전화번호에 대응되는 안내명입니다.',
  },
  homepage: {
    id: 'homepage',
    nameKo: '홈페이지',
    required: false,
    sample: '<a href="https://tour.daegu.go.kr" target="_blank">홈페이지</a>',
    description: '관광정보 홈페이지 HTML 링크입니다.',
  },
  title: {
    id: 'title',
    nameKo: '제목',
    required: true,
    sample: '중문향토오일시장',
    description: '콘텐츠 제목입니다.',
  },
  lDongRegnCd: {
    id: 'lDongRegnCd',
    nameKo: '법정동 시도 코드',
    required: false,
    sample: '50',
    description: '법정동 시도 코드입니다.',
  },
  lDongSignguCd: {
    id: 'lDongSignguCd',
    nameKo: '법정동 시군구 코드',
    required: false,
    sample: '130',
    description: '법정동 시군구 코드입니다.',
  },
  lclsSystm1: {
    id: 'lclsSystm1',
    nameKo: '분류체계 대분류',
    required: false,
    sample: 'SH',
    description: '분류체계 대분류 코드입니다.',
  },
  lclsSystm2: {
    id: 'lclsSystm2',
    nameKo: '분류체계 중분류',
    required: false,
    sample: 'SH06',
    description: '분류체계 중분류 코드입니다.',
  },
  lclsSystm3: {
    id: 'lclsSystm3',
    nameKo: '분류체계 소분류',
    required: false,
    sample: 'SH060100',
    description: '분류체계 소분류 코드입니다.',
  },
  zipcode: {
    id: 'zipcode',
    nameKo: '우편번호',
    required: false,
    sample: '63546',
    description: '우편번호입니다.',
  },
  overview: {
    id: 'overview',
    nameKo: '개요',
    required: false,
    sample: '관광지 소개 문장입니다.',
    description: '관광정보 개요 설명입니다.',
  },
  code: {
    id: 'code',
    nameKo: '코드',
    required: false,
    sample: '110',
    description: '코드조회 결과의 코드값입니다.',
  },
  name: {
    id: 'name',
    nameKo: '코드명',
    required: false,
    sample: '종로구',
    description: '코드조회 결과의 코드명입니다.',
  },
  rnum: {
    id: 'rnum',
    nameKo: '일련번호',
    required: false,
    sample: '1',
    description: '응답 일련번호입니다.',
  },
  lDongRegnNm: {
    id: 'lDongRegnNm',
    nameKo: '법정동 시도명',
    required: false,
    sample: '서울특별시',
    description: '법정동 시도명입니다.',
  },
  lDongSignguNm: {
    id: 'lDongSignguNm',
    nameKo: '법정동 시군구명',
    required: false,
    sample: '종로구',
    description: '법정동 시군구명입니다.',
  },
  lclsSystm1Cd: {
    id: 'lclsSystm1Cd',
    nameKo: '분류체계 대분류코드',
    required: false,
    sample: 'AC',
    description: '분류체계 전체목록조회 시 표출되는 대분류 코드입니다.',
  },
  lclsSystm1Nm: {
    id: 'lclsSystm1Nm',
    nameKo: '분류체계 대분류명',
    required: false,
    sample: '숙박',
    description: '분류체계 전체목록조회 시 표출되는 대분류명입니다.',
  },
  lclsSystm2Cd: {
    id: 'lclsSystm2Cd',
    nameKo: '분류체계 중분류코드',
    required: false,
    sample: 'AC01',
    description: '분류체계 전체목록조회 시 표출되는 중분류 코드입니다.',
  },
  lclsSystm2Nm: {
    id: 'lclsSystm2Nm',
    nameKo: '분류체계 중분류명',
    required: false,
    sample: '호텔',
    description: '분류체계 전체목록조회 시 표출되는 중분류명입니다.',
  },
  lclsSystm3Cd: {
    id: 'lclsSystm3Cd',
    nameKo: '분류체계 소분류코드',
    required: false,
    sample: 'AC010100',
    description: '분류체계 전체목록조회 시 표출되는 소분류 코드입니다.',
  },
  lclsSystm3Nm: {
    id: 'lclsSystm3Nm',
    nameKo: '분류체계 소분류명',
    required: false,
    sample: '호텔',
    description: '분류체계 전체목록조회 시 표출되는 소분류명입니다.',
  },
};

const commonParamIds: TourismApiParameterId[] = [
  'numOfRows',
  'pageNo',
  'MobileOS',
  'MobileApp',
  'serviceKey',
  '_type',
];

const legalDistrictParamIds: TourismApiParameterId[] = [
  'lDongRegnCd',
  'lDongSignguCd',
];

const classificationParamIds: TourismApiParameterId[] = [
  'lclsSystm1',
  'lclsSystm2',
  'lclsSystm3',
];

const listResponseFieldIds: TourismApiResponseFieldId[] = [
  'resultCode',
  'resultMsg',
  'numOfRows',
  'pageNo',
  'totalCount',
  'addr1',
  'addr2',
  'contentid',
  'contenttypeid',
  'createdtime',
  'firstimage',
  'firstimage2',
  'cpyrhtDivCd',
  'mapx',
  'mapy',
  'mlevel',
  'modifiedtime',
  'tel',
  'title',
  'lDongRegnCd',
  'lDongSignguCd',
  'lclsSystm1',
  'lclsSystm2',
  'lclsSystm3',
  'zipcode',
];

const detailCommonResponseFieldIds: TourismApiResponseFieldId[] = [
  ...listResponseFieldIds,
  'telname',
  'homepage',
  'overview',
];

export const tourismApiOperations: Record<
  TourismApiOperationId,
  TourismApiOperation
> = {
  areaBasedList2: {
    id: 'areaBasedList2',
    order: 1,
    nameKo: '지역기반 관광정보 조회',
    operationType: '조회 (목록)',
    path: '/areaBasedList2',
    description: '지역 및 시군구를 기반으로 관광정보 목록을 조회합니다.',
    requestParamIds: [
      ...commonParamIds,
      'arrange',
      'contentTypeId',
      'modifiedtime',
      ...legalDistrictParamIds,
      ...classificationParamIds,
    ],
    responseFieldIds: listResponseFieldIds,
    portfolioUse: '지역 필터를 붙인 관광정보 검색 화면으로 확장할 때 사용합니다.',
  },
  locationBasedList2: {
    id: 'locationBasedList2',
    order: 2,
    nameKo: '위치기반 관광정보 조회',
    operationType: '조회 (목록)',
    path: '/locationBasedList2',
    description: '내 주변 좌표를 기반으로 관광정보 목록을 조회합니다.',
    requestParamIds: [
      ...commonParamIds,
      'arrange',
      'contentTypeId',
      'mapX',
      'mapY',
      'radius',
      'modifiedtime',
      ...legalDistrictParamIds,
      ...classificationParamIds,
    ],
    responseFieldIds: listResponseFieldIds,
    portfolioUse: '좌표 기반 주변 관광정보 검색 데모로 확장할 때 사용합니다.',
  },
  searchKeyword2: {
    id: 'searchKeyword2',
    order: 3,
    nameKo: '키워드 검색 조회',
    operationType: '조회 (목록)',
    path: '/searchKeyword2',
    description: '키워드로 관광타입별 또는 전체 관광정보 목록을 조회합니다.',
    requestParamIds: [
      ...commonParamIds,
      'arrange',
      'keyword',
      ...legalDistrictParamIds,
      ...classificationParamIds,
    ],
    responseFieldIds: listResponseFieldIds,
    portfolioUse: '현재 API Playground의 검색 카드와 결과 카드 데이터 소스입니다.',
  },
  searchFestival2: {
    id: 'searchFestival2',
    order: 4,
    nameKo: '행사정보 조회',
    operationType: '조회 (목록)',
    path: '/searchFestival2',
    description: '행사/공연/축제 정보를 날짜 조건으로 조회합니다.',
    requestParamIds: [
      ...commonParamIds,
      'arrange',
      'eventStartDate',
      'eventEndDate',
      'modifiedtime',
      ...legalDistrictParamIds,
      ...classificationParamIds,
    ],
    responseFieldIds: listResponseFieldIds,
    portfolioUse: '기간 필터와 날짜 입력 UI를 보여주는 검색 흐름으로 확장할 수 있습니다.',
  },
  searchStay2: {
    id: 'searchStay2',
    order: 5,
    nameKo: '숙박정보 조회',
    operationType: '조회 (목록)',
    path: '/searchStay2',
    description: '숙박 정보 목록을 조회합니다.',
    requestParamIds: [
      ...commonParamIds,
      'arrange',
      'modifiedtime',
      ...legalDistrictParamIds,
      ...classificationParamIds,
    ],
    responseFieldIds: listResponseFieldIds,
    portfolioUse: '숙박 타입 전용 필터와 결과 카드로 확장할 때 사용합니다.',
  },
  detailCommon2: {
    id: 'detailCommon2',
    order: 6,
    nameKo: '공통정보 조회',
    operationType: '조회 (목록)',
    path: '/detailCommon2',
    description: '기본정보, 대표 이미지, 분류, 지역, 주소, 좌표, 개요를 조회합니다.',
    requestParamIds: [...commonParamIds, 'contentId'],
    responseFieldIds: detailCommonResponseFieldIds,
    portfolioUse: '검색 결과 다이얼로그의 상세 탭을 실제 상세 API로 확장할 때 사용합니다.',
  },
  detailIntro2: {
    id: 'detailIntro2',
    order: 7,
    nameKo: '소개정보 조회',
    operationType: '조회 (목록)',
    path: '/detailIntro2',
    description: '관광타입별 휴무일, 개장시간, 주차시설 등 소개정보를 조회합니다.',
    requestParamIds: [...commonParamIds, 'contentId', 'contentTypeId'],
    responseFieldIds: ['resultCode', 'resultMsg', 'contentid', 'contenttypeid'],
    portfolioUse: '콘텐츠 타입별 다른 상세 필드를 동적으로 렌더링하는 예제로 확장합니다.',
  },
  detailInfo2: {
    id: 'detailInfo2',
    order: 8,
    nameKo: '반복정보 조회',
    operationType: '조회 (목록)',
    path: '/detailInfo2',
    description:
      '숙박 객실정보, 여행코스 코스정보, 기타 타입의 반복 상세정보를 조회합니다.',
    requestParamIds: [...commonParamIds, 'contentId', 'contentTypeId'],
    responseFieldIds: ['resultCode', 'resultMsg', 'contentid', 'contenttypeid'],
    portfolioUse: '상세 다이얼로그 안의 반복 섹션 렌더링 예제로 확장합니다.',
  },
  detailImage2: {
    id: 'detailImage2',
    order: 9,
    nameKo: '이미지정보 조회',
    operationType: '조회 (목록)',
    path: '/detailImage2',
    description: '관광타입별 이미지 URL 목록과 이미지 저작권 유형을 조회합니다.',
    requestParamIds: [...commonParamIds, 'contentId', 'imageYN'],
    responseFieldIds: ['resultCode', 'resultMsg', 'contentid', 'firstimage'],
    portfolioUse: '상세 다이얼로그의 이미지 갤러리와 저작권 표시로 확장합니다.',
  },
  areaBasedSyncList2: {
    id: 'areaBasedSyncList2',
    order: 10,
    nameKo: '국문 관광정보 동기화 목록 조회',
    operationType: '조회(상세)',
    path: '/areaBasedSyncList2',
    description: '관광정보 동기화 목록을 수정일과 표출 여부 조건으로 조회합니다.',
    requestParamIds: [
      ...commonParamIds,
      'showflag',
      'modifiedtime',
      'arrange',
      'contentTypeId',
      ...legalDistrictParamIds,
      ...classificationParamIds,
      'oldContentid',
    ],
    responseFieldIds: listResponseFieldIds,
    portfolioUse: '동기화 기준 증분 조회와 데이터 갱신 상태 UI로 확장할 수 있습니다.',
  },
  detailPetTour2: {
    id: 'detailPetTour2',
    order: 11,
    nameKo: '반려동물 동반여행 정보 조회',
    operationType: '조회(상세)',
    path: '/detailPetTour2',
    description: '타입별 반려동물 여행 정보를 조회합니다.',
    requestParamIds: [...commonParamIds, 'contentid'],
    responseFieldIds: ['resultCode', 'resultMsg', 'contentid'],
    portfolioUse: '상세 다이얼로그의 부가 정보 배지나 반려동물 동반 가능 정보로 확장합니다.',
  },
  ldongCode2: {
    id: 'ldongCode2',
    order: 12,
    nameKo: '법정동 코드 조회',
    operationType: '조회 (목록)',
    path: '/ldongCode2',
    description: '법정동 시도코드와 시군구코드 목록을 조회합니다.',
    requestParamIds: [...commonParamIds, 'lDongRegnCd', 'lDongListYn'],
    responseFieldIds: [
      'resultCode',
      'resultMsg',
      'numOfRows',
      'pageNo',
      'totalCount',
      'code',
      'name',
      'rnum',
      'lDongRegnCd',
      'lDongRegnNm',
      'lDongSignguCd',
      'lDongSignguNm',
    ],
    portfolioUse: '지역 선택 필터의 시도/시군구 옵션 데이터로 사용합니다.',
  },
  lclsSystmCode2: {
    id: 'lclsSystmCode2',
    order: 13,
    nameKo: '분류체계 코드 조회',
    operationType: '조회 (목록)',
    path: '/lclsSystmCode2',
    description: '콘텐츠별 1Depth, 2Depth, 3Depth 분류체계 코드를 조회합니다.',
    requestParamIds: [
      ...commonParamIds,
      ...classificationParamIds,
      'lclsSystmListYn',
    ],
    responseFieldIds: [
      'resultCode',
      'resultMsg',
      'numOfRows',
      'pageNo',
      'totalCount',
      'code',
      'name',
      'rnum',
      'lclsSystm1Cd',
      'lclsSystm1Nm',
      'lclsSystm2Cd',
      'lclsSystm2Nm',
      'lclsSystm3Cd',
      'lclsSystm3Nm',
    ],
    portfolioUse: '대/중/소분류 cascading filter와 코드 라벨 매핑으로 사용합니다.',
  },
};

export const tourismPortalErrorCodes: TourismApiResultCode[] = [
  { code: '01', message: 'APPLICATION_ERROR', description: '어플리케이션 에러' },
  { code: '04', message: 'HTTP_ERROR', description: 'HTTP 에러' },
  {
    code: '12',
    message: 'NO_OPENAPI_SERVICE_ERROR',
    description: '해당 오픈API 서비스가 없거나 폐기됨',
  },
  { code: '20', message: 'SERVICE_ACCESS_DENIED_ERROR', description: '서비스 접근 거부' },
  {
    code: '22',
    message: 'LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR',
    description: '서비스 요청 제한 횟수 초과 에러',
  },
  {
    code: '30',
    message: 'SERVICE_KEY_IS_NOT_REGISTERED_ERROR',
    description: '등록되지 않은 서비스키',
  },
  { code: '31', message: 'DEADLINE_HAS_EXPIRED_ERROR', description: '활용 기간 만료' },
  { code: '32', message: 'UNREGISTERED_IP_ERROR', description: '등록되지 않은 IP' },
  { code: '99', message: 'UNKNOWN_ERROR', description: '기타 에러' },
];

export const tourismProviderResultCodes: TourismApiResultCode[] = [
  { code: '00', message: 'NORMAL_CODE', description: '정상' },
  { code: '01', message: 'APPLICATION_ERROR', description: '어플리케이션 에러' },
  { code: '02', message: 'DB_ERROR', description: '데이터 베이스 에러' },
  { code: '03', message: 'NODATA_ERROR', description: '데이터 없음 에러' },
  { code: '04', message: 'HTTP_ERROR', description: 'HTTP 에러' },
  { code: '05', message: 'SERVICETIMEOUT_ERROR', description: '서비스 연결 실패 에러' },
  {
    code: '10',
    message: 'INVALID_REQUEST_PARAMETER_ERROR',
    description: '잘못된 요청 파라메터 에러',
  },
  {
    code: '11',
    message: 'NO_MANDATORY_REQUEST_PARAMETERS_ERROR',
    description: '필수 요청 파라메터가 없음',
  },
  {
    code: '12',
    message: 'NO_OPENAPI_SERVICE_ERROR',
    description: '해당 오픈API서비스가 없거나 폐기됨',
  },
  { code: '20', message: 'SERVICE_ACCESS_DENIED_ERROR', description: '서비스 접근 거부' },
  {
    code: '21',
    message: 'TEMPORARILY_DISABLE_THE_SERVICEKEY_ERROR',
    description: '일시적으로 사용할 수 없는 서비스 키',
  },
  {
    code: '22',
    message: 'LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR',
    description: '서비스 요청 제한 횟수 초과 에러',
  },
  {
    code: '30',
    message: 'SERVICE_KEY_IS_NOT_REGISTERED_ERROR',
    description: '등록되지 않은 서비스키',
  },
  { code: '31', message: 'DEADLINE_HAS_EXPIRED_ERROR', description: '활용기간 만료' },
  { code: '32', message: 'UNREGISTERED_IP_ERROR', description: '등록되지 않은 IP' },
  { code: '33', message: 'UNSIGNED_CALL_ERROR', description: '서명되지 않은 호출' },
  { code: '99', message: 'UNKNOWN_ERROR', description: '기타 에러' },
];

export const tourismPortfolioApiFlows = [
  {
    id: 'keyword-search-to-detail',
    title: '키워드 검색에서 상세 다이얼로그까지',
    operationIds: [
      'searchKeyword2',
      'detailCommon2',
      'detailIntro2',
      'detailInfo2',
      'detailImage2',
    ] satisfies TourismApiOperationId[],
    description:
      '검색 결과 카드 선택 후 공통정보, 소개정보, 반복정보, 이미지정보를 단계적으로 붙이는 상세 흐름입니다.',
  },
  {
    id: 'code-backed-filters',
    title: '코드 조회 기반 검색 필터',
    operationIds: ['ldongCode2', 'lclsSystmCode2'] satisfies TourismApiOperationId[],
    description:
      '법정동 코드와 분류체계 코드를 cascading select로 연결해 실제 서비스형 검색 조건을 구성합니다.',
  },
  {
    id: 'incremental-sync',
    title: '수정일 기준 동기화 조회',
    operationIds: ['areaBasedSyncList2'] satisfies TourismApiOperationId[],
    description:
      '수정일, 표출 여부, 이전 콘텐츠 ID 기준으로 증분 데이터 조회 상태를 보여줍니다.',
  },
] as const;

export const getTourismApiOperation = (
  operationId: TourismApiOperationId,
): TourismApiOperation => tourismApiOperations[operationId];

export const getTourismApiRequestParameters = (
  operationId: TourismApiOperationId,
): TourismApiParameter[] =>
  tourismApiOperations[operationId].requestParamIds.map(
    (paramId) => tourismApiRequestParameters[paramId],
  );

export const getTourismApiResponseFields = (
  operationId: TourismApiOperationId,
): TourismApiResponseField[] =>
  tourismApiOperations[operationId].responseFieldIds.map(
    (fieldId) => tourismApiResponseFields[fieldId],
  );
