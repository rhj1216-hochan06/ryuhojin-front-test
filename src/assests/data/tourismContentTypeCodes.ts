//신분류체계정보 관광타입정보 연계 정의서.xlsx 문서를 ai를 활용하여 ts화를 진행하였습니다.
export interface TourismContentTypeCode {
  contentTypeId: string;
  multilingualCode: string;
  name: string;
}

export const tourismContentTypeCodes: Record<string, TourismContentTypeCode> = {
  '12': {
    contentTypeId: '12',
    multilingualCode: '76',
    name: '관광지',
  },
  '14': {
    contentTypeId: '14',
    multilingualCode: '78',
    name: '문화시설',
  },
  '15': {
    contentTypeId: '15',
    multilingualCode: '85',
    name: '축제/공연/행사',
  },
  '25': {
    contentTypeId: '25',
    multilingualCode: '-',
    name: '여행코스',
  },
  '28': {
    contentTypeId: '28',
    multilingualCode: '75',
    name: '레포츠',
  },
  '32': {
    contentTypeId: '32',
    multilingualCode: '80',
    name: '숙박',
  },
  '38': {
    contentTypeId: '38',
    multilingualCode: '79',
    name: '쇼핑',
  },
  '39': {
    contentTypeId: '39',
    multilingualCode: '82',
    name: '음식점',
  },
};

export const getTourismContentTypeCode = (
  contentTypeId: string | undefined,
): TourismContentTypeCode => {
  if (!contentTypeId) {
    return {
      contentTypeId: '-',
      multilingualCode: '-',
      name: '콘텐츠 타입 미분류',
    };
  }

  return (
    tourismContentTypeCodes[contentTypeId] ?? {
      contentTypeId,
      multilingualCode: '-',
      name: `기타 (${contentTypeId})`,
    }
  );
};
