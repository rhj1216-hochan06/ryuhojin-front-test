import type {
  GenderBoxPlotGender,
  KpiMetric,
  Locale,
  NavigationItem,
  PortfolioGridImpact,
  PortfolioGridStatus,
  RoadmapStatus,
} from '../types/dashboard';

type WorkflowNodeKey = 'A' | 'C' | 'D2' | 'A-1' | 'C-1' | 'D2-1';

export interface ChartCardCopy {
  title: string;
  description: string;
  ariaLabel: string;
  fallbackDescription: string;
}

export interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
}

export interface SankeyCopy {
  ariaLabel: string;
  legendLabel: string;
  fallbackDescription: string;
  previousYear: string;
  currentYear: string;
  unitLabel: string;
  numberLocale: string;
  nodeLabels: Record<WorkflowNodeKey, string>;
  legendItems: {
    veryImproved: string;
    improved: string;
    noChange: string;
    worsened: string;
    veryWorsened: string;
  };
}

export interface ChartOptionLabels {
  businessTrend: {
    revenueIndex: string;
    activeUsers: string;
    conversionRate: string;
    revenueAxis: string;
    conversionAxis: string;
  };
  implementationTrend: {
    previous: string;
    current: string;
    reviewScore: string;
    casesAxis: string;
    reviewAxis: string;
  };
  qualityScatter: {
    cycleTimeAxis: string;
    defectRateAxis: string;
    complexityHigh: string;
    complexityLow: string;
    seriesName: string;
  };
  genderBoxPlot: {
    valueAxis: string;
    seriesName: string;
    numberLocale: string;
    genderLabels: Record<GenderBoxPlotGender, string>;
    statsLabels: {
      min: string;
      q1: string;
      median: string;
      q3: string;
      max: string;
      outlier: string;
    };
  };
  categoryShare: {
    centerLabel: string;
    seriesName: string;
    numberLocale: string;
  };
}

export interface TimelineCopy {
  editorLabel: string;
  editorTitle: string;
  editorDescription: string;
  visibleLabel: string;
  titleLabel: string;
  groupLabel: string;
  statusLabel: string;
  startLabel: string;
  endLabel: string;
  progressLabel: string;
  shellLabel: string;
  summary: (visibleCount: number, groupCount: number) => string;
  zoomControlsLabel: string;
  zoomInLabel: string;
  zoomOutLabel: string;
  resetLabel: string;
  sidebarLabel: string;
  momentLocale: string;
  markerLabels: {
    now: string;
    today: string;
  };
  statusLabels: Record<RoadmapStatus, string>;
}

export interface CustomGridCopy {
  ariaLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  categoryLabel: string;
  allCategoriesLabel: string;
  selectedLabel: (count: number) => string;
  editModeLabel: string;
  editModeNote: string;
  cancelLabel: string;
  saveLabel: string;
  addRowLabel: string;
  addChildLabel: string;
  deleteSelectedLabel: string;
  newRowLabel: string;
  newChildLabel: string;
  newRowPlaceholder: {
    capability: string;
    category: string;
    owner: string;
    coverage: string;
  };
  newChildPlaceholder: {
    name: string;
    owner: string;
  };
  clearLabel: string;
  expandLabel: string;
  collapseLabel: string;
  selectAllLabel: string;
  selectRowLabel: (capability: string) => string;
  toggleRowLabel: (action: string, capability: string) => string;
  headers: {
    capability: string;
    category: string;
    owner: string;
    status: string;
    coverage: string;
    updated: string;
  };
  impactSuffix: string;
  addedChildNote: string;
  statusLabels: Record<PortfolioGridStatus, string>;
  impactLabels: Record<PortfolioGridImpact, string>;
}

export interface TableHeaders {
  project: string;
  domain: string;
  status: string;
  leadTime: string;
  chartCoverage: string;
  apiContract: string;
  updatedAt: string;
  leadTimeUnitLabel: string;
  statusLabels: Record<'Stable' | 'Improving' | 'Watch', string>;
}

export interface DashboardDictionary {
  appName: string;
  appSubtitle: string;
  nav: NavigationItem[];
  navigationLabel: string;
  homeLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroCtaLabel: string;
  portfolioLinkLabel: string;
  portfolioFocusLabel: string;
  portfolioFocus: string[];
  previewLabel: string;
  previewTechLabel: string;
  updatedLabel: string;
  dateTimeLocale: string;
  heroStats: {
    chartCases: string;
    timelineItems: string;
    gridRows: string;
  };
  languageLabel: string;
  refreshLabel: string;
  loading: string;
  errorTitle: string;
  trendLabels: Record<KpiMetric['trend'], string>;
  chartCards: {
    businessTrend: ChartCardCopy;
    implementationTrend: ChartCardCopy;
    qualityScatter: ChartCardCopy;
    genderBoxPlot: ChartCardCopy;
    capabilityTreemap: ChartCardCopy;
    categoryShare: ChartCardCopy;
    sankey: {
      title: string;
      description: string;
    };
  };
  chartOptions: ChartOptionLabels;
  sankey: SankeyCopy;
  timeline: TimelineCopy;
  customGrid: CustomGridCopy;
  dataGridCard: {
    title: string;
    description: string;
  };
  pages: {
    charts: SectionCopy;
    dataGrid: SectionCopy;
    timeline: SectionCopy;
  };
  demoRoutes: SectionCopy & {
    openLabel: string;
  };
  sections: {
    overview: SectionCopy;
    skills: SectionCopy;
    charts: SectionCopy;
    timeline: SectionCopy;
    table: SectionCopy;
  };
  tableHeaders: TableHeaders;
}

export const dictionary: Record<Locale, DashboardDictionary> = {
  ko: {
    appName: '류호진',
    appSubtitle: 'Frontend Portfolio',
    navigationLabel: '주요 페이지',
    homeLabel: '홈으로 이동',
    heroEyebrow: 'Frontend Portfolio',
    heroTitle: '실무에서 자주 만나는 데이터 UI를 직접 구현했습니다',
    heroBody:
      '차트, 일정, 그리드가 섞인 운영형 UI를 React와 TypeScript로 재구성했습니다. 실제 데이터 없이도 화면 설계와 컴포넌트 책임이 보이도록 만든 포트폴리오 데모입니다.',
    heroCtaLabel: '구현 화면 보기',
    portfolioLinkLabel: 'Notion Portfolio',
    portfolioFocusLabel: '포트폴리오 구현 포커스',
    portfolioFocus: ['차트 공통화', '간트 타임라인', '커스텀 그리드', '다국어 화면'],
    previewLabel: '포트폴리오 화면 미리보기',
    previewTechLabel: 'React + TypeScript',
    updatedLabel: '업데이트',
    dateTimeLocale: 'ko-KR',
    heroStats: {
      chartCases: '차트 예제',
      timelineItems: '일정 항목',
      gridRows: '그리드 행',
    },
    languageLabel: '언어 변경',
    refreshLabel: '데이터 새로고침',
    loading: '데이터를 불러오는 중입니다.',
    errorTitle: '데이터를 불러오지 못했습니다.',
    trendLabels: {
      up: '개선',
      down: '감소',
      flat: '유지',
    },
    chartCards: {
      businessTrend: {
        title: 'Bar + Line',
        description: '월별 지표와 전환율을 하나의 option builder에서 생성합니다.',
        ariaLabel: '월별 매출, 활성 사용자, 전환율 차트',
        fallbackDescription: '월별 지표를 막대와 라인으로 함께 비교하는 차트입니다.',
      },
      implementationTrend: {
        title: 'Portfolio Chart Trend',
        description:
          '전년도 비교 막대와 리뷰 점수를 함께 보여주고, 긴 데이터는 dataZoom으로 탐색합니다.',
        ariaLabel: '포트폴리오 차트 구현 추이',
        fallbackDescription: '이전 값과 현재 값을 비교하고 리뷰 점수를 라인으로 표시하는 복합 차트입니다.',
      },
      qualityScatter: {
        title: 'Quality Scatter',
        description:
          '처리 기간, 결함률, 복잡도를 scatter chart와 visualMap으로 함께 비교합니다.',
        ariaLabel: '기능 품질과 복잡도 scatter chart',
        fallbackDescription:
          '각 기능의 처리 기간, 결함률, 복잡도를 점 위치와 색상으로 비교하는 산점도입니다.',
      },
      genderBoxPlot: {
        title: 'Gender Box Plot',
        description:
          '성별과 연령 그룹별 분포를 boxplot과 outlier 점으로 비교하는 더미 예제입니다.',
        ariaLabel: '성별과 연령 그룹별 분포 boxplot chart',
        fallbackDescription:
          '성별과 연령 그룹별 최솟값, 사분위수, 중앙값, 최댓값, 이상치를 비교하는 boxplot 차트입니다.',
      },
      capabilityTreemap: {
        title: 'Capability Treemap',
        description: '차트 아카이브의 구현 영역을 크기와 색상 강도로 재구성한 treemap 예제입니다.',
        ariaLabel: '포트폴리오 시각화 역량 treemap',
        fallbackDescription: 'ECharts, 마크업 차트, 공통 UX 항목의 비중을 treemap으로 표시합니다.',
      },
      categoryShare: {
        title: '파이 차트',
        description: '범례와 라벨이 있는 pie chart로 차트 예제 분포를 요약합니다.',
        ariaLabel: '차트 카테고리 비율 pie chart',
        fallbackDescription: '차트 예제 카테고리별 비율을 도넛 차트로 표시합니다.',
      },
      sankey: {
        title: '커스텀 컴포넌트 + Sankey Flow',
        description:
          '전년 대비 판정현황 화면을 참고해 좌우 상태 막대와 흐름선, 범례, 수치를 분리해 구성했습니다.',
      },
    },
    chartOptions: {
      businessTrend: {
        revenueIndex: '매출 지수',
        activeUsers: '활성 사용자',
        conversionRate: '전환율',
        revenueAxis: '매출',
        conversionAxis: '전환',
      },
      implementationTrend: {
        previous: '이전',
        current: '현재',
        reviewScore: '리뷰 점수',
        casesAxis: '건수',
        reviewAxis: '리뷰',
      },
      qualityScatter: {
        cycleTimeAxis: '처리 기간',
        defectRateAxis: '결함률',
        complexityHigh: '높은 복잡도',
        complexityLow: '낮음',
        seriesName: '기능 품질',
      },
      genderBoxPlot: {
        valueAxis: '지표값',
        seriesName: '성별 분포',
        numberLocale: 'ko-KR',
        genderLabels: {
          Male: '남성',
          Female: '여성',
        },
        statsLabels: {
          min: '최솟값',
          q1: '1사분위',
          median: '중앙값',
          q3: '3사분위',
          max: '최댓값',
          outlier: '이상치',
        },
      },
      categoryShare: {
        centerLabel: '예제',
        seriesName: '차트 아카이브',
        numberLocale: 'ko-KR',
      },
    },
    sankey: {
      ariaLabel: '전년 대비 판정현황 sankey chart',
      legendLabel: 'Sankey 범례',
      fallbackDescription:
        '2024년 A, C, D2 상태가 2025년 A, C, D2 상태로 이동한 비율을 흐름선으로 표시합니다.',
      previousYear: '2024년',
      currentYear: '2025년',
      unitLabel: '(명)',
      numberLocale: 'ko-KR',
      nodeLabels: {
        A: '좋음',
        C: '보통',
        D2: '나쁨',
        'A-1': '좋음',
        'C-1': '보통',
        'D2-1': '나쁨',
      },
      legendItems: {
        veryImproved: '매우 완화',
        improved: '완화',
        noChange: '변화없음',
        worsened: '악화',
        veryWorsened: '매우 악화',
      },
    },
    timeline: {
      editorLabel: 'Timeline 항목 편집 목록',
      editorTitle: 'Timeline Items',
      editorDescription: '왼쪽 리스트에서 제목, 그룹, 기간, 상태, 표시 여부를 수정합니다.',
      visibleLabel: '표시',
      titleLabel: '제목',
      groupLabel: '그룹',
      statusLabel: '상태',
      startLabel: '시작',
      endLabel: '종료',
      progressLabel: '진행률',
      shellLabel: '포트폴리오 roadmap timeline',
      summary: (visibleCount, groupCount) =>
        `${visibleCount}개 항목 표시 / ${groupCount}개 그룹`,
      zoomControlsLabel: 'Timeline 확대 축소 컨트롤',
      zoomInLabel: '확대',
      zoomOutLabel: '축소',
      resetLabel: '초기화',
      sidebarLabel: '구분',
      momentLocale: 'ko',
      markerLabels: {
        now: '현재',
        today: '오늘',
      },
      statusLabels: {
        done: '완료',
        active: '진행 중',
        planned: '예정',
      },
    },
    customGrid: {
      ariaLabel: '포트폴리오 custom data grid',
      searchLabel: '검색',
      searchPlaceholder: '역량 또는 작업 검색',
      categoryLabel: '카테고리',
      allCategoriesLabel: '전체 카테고리',
      selectedLabel: (count) => `${count}개 선택`,
      editModeLabel: '수정 모드',
      editModeNote: '수정 모드: 리스트를 수정 해서 저장 할수 있습니다.',
      cancelLabel: '취소',
      saveLabel: '저장',
      addRowLabel: '추가',
      addChildLabel: '추가',
      deleteSelectedLabel: '선택 삭제',
      newRowLabel: '신규',
      newChildLabel: '하위 추가',
      newRowPlaceholder: {
        capability: '새 역량',
        category: '카테고리',
        owner: '담당자',
        coverage: '0',
      },
      newChildPlaceholder: {
        name: '하위 작업',
        owner: '담당자',
      },
      clearLabel: '초기화',
      expandLabel: '펼치기',
      collapseLabel: '접기',
      selectAllLabel: '현재 보이는 행 전체 선택',
      selectRowLabel: (capability) => `${capability} 선택`,
      toggleRowLabel: (action, capability) => `${capability} ${action}`,
      headers: {
        capability: '역량',
        category: '카테고리',
        owner: '담당',
        status: '상태',
        coverage: '커버리지',
        updated: '업데이트',
      },
      impactSuffix: '영향도',
      addedChildNote: '수정 모드에서 추가한 항목입니다.',
      statusLabels: {
        Stable: '안정',
        Improving: '개선 중',
        Review: '검토',
      },
      impactLabels: {
        High: '높음',
        Medium: '중간',
        Low: '낮음',
      },
    },
    dataGridCard: {
      title: 'Custom Data Grid',
      description:
        'AccordionTable과 RealGrid 경험을 더미 데이터로 재구성한 검색, 정렬, 필터, 선택 예제입니다.',
    },
    nav: [
      { id: 'home', label: '홈', href: '#/', path: '/' },
      { id: 'charts', label: '차트', href: '#/charts', path: '/charts' },
      { id: 'data-grid', label: '데이터 그리드', href: '#/data-grid', path: '/data-grid' },
      { id: 'timeline', label: '타임라인', href: '#/timeline', path: '/timeline' },
    ],
    pages: {
      charts: {
        eyebrow: 'Charts Page',
        title: '차트 구현 사례를 한 페이지에서 검증합니다',
        description:
          'ECharts wrapper, option builder, i18n label, legend state, resize 처리를 차트 예제별로 분리해 보여줍니다.',
      },
      dataGrid: {
        eyebrow: 'Data Grid Page',
        title: '운영형 그리드 상호작용을 따로 검증합니다',
        description:
          '검색, 필터, 정렬, parent/child 선택, 편집 모드 흐름을 분리된 페이지에서 확인할 수 있습니다.',
      },
      timeline: {
        eyebrow: 'Timeline Page',
        title: '일정 편집과 timeline 조작을 분리해 보여줍니다',
        description:
          '왼쪽 편집 패널과 react-calendar-timeline canvas를 함께 배치해 move, resize, zoom 흐름을 확인합니다.',
      },
    },
    demoRoutes: {
      eyebrow: 'Demo Routes',
      title: '기능별 데모 페이지',
      description:
        '메인 페이지는 프로젝트 맥락을 설명하고, 복잡한 UI는 기능별 페이지에서 집중해서 확인할 수 있도록 나눴습니다.',
      openLabel: '페이지 열기',
    },
    sections: {
      overview: {
        eyebrow: 'About',
        title: '프로젝트 개요',
        description:
          '실제 회사 데이터 없이도 실무에서 다뤘던 설계 포인트를 설명할 수 있도록 재구성했습니다.',
      },
      skills: {
        eyebrow: 'Skill Summary',
        title: '핵심 역량 요약',
        description:
          'UI 컴포넌트, 데이터 가공, 차트 공통화, API 계약을 분리해 유지보수 관점의 코드를 보여줍니다.',
      },
      charts: {
        eyebrow: 'ECharts Showcase',
        title: 'ECharts 차트 아카이브 데모',
        description:
          '포트폴리오의 차트 공통화 경험을 바탕으로 bar+line, dataZoom, scatter, boxplot, pie, treemap, sankey 예제를 구성했습니다.',
      },
      timeline: {
        eyebrow: 'Roadmap',
        title: 'react-calendar-timeline 편집 예제',
        description:
          '왼쪽 리스트에서 timeline 항목을 수정하고, 확대/축소와 item move/resize 흐름을 확인할 수 있습니다.',
      },
      table: {
        eyebrow: 'Data Grid',
        title: 'Custom Data Grid',
        description:
          '계층형 데이터, 검색, 필터, 정렬, 선택, 편집 흐름을 포함한 포트폴리오형 더미 데이터 그리드를 보여줍니다.',
      },
    },
    tableHeaders: {
      project: '프로젝트',
      domain: '도메인',
      status: '상태',
      leadTime: '리드타임',
      chartCoverage: '차트 커버리지',
      apiContract: 'API 계약',
      updatedAt: '업데이트',
      leadTimeUnitLabel: '일',
      statusLabels: {
        Stable: '안정',
        Improving: '개선 중',
        Watch: '관찰',
      },
    },
  },
  en: {
    appName: 'Ryu Hojin',
    appSubtitle: 'Frontend Portfolio',
    navigationLabel: 'Primary pages',
    homeLabel: 'Go to home',
    heroEyebrow: 'Frontend Portfolio',
    heroTitle: 'I make dense product screens easier to read',
    heroBody:
      'A React and TypeScript portfolio demo for chart-heavy operations screens, timelines, and custom grids, rebuilt with dummy data and clear component boundaries.',
    heroCtaLabel: 'View demos',
    portfolioLinkLabel: 'Notion Portfolio',
    portfolioFocusLabel: 'Portfolio focus',
    portfolioFocus: ['Chart system', 'Gantt timeline', 'Custom grid', 'i18n UI'],
    previewLabel: 'Portfolio screen preview',
    previewTechLabel: 'React + TypeScript',
    updatedLabel: 'Updated',
    dateTimeLocale: 'en-US',
    heroStats: {
      chartCases: 'Chart cases',
      timelineItems: 'Timeline items',
      gridRows: 'Grid rows',
    },
    languageLabel: 'Change language',
    refreshLabel: 'Refresh data',
    loading: 'Loading dashboard data.',
    errorTitle: 'Failed to load dashboard data.',
    trendLabels: {
      up: 'Improving',
      down: 'Reduced',
      flat: 'Steady',
    },
    chartCards: {
      businessTrend: {
        title: 'Bar + Line',
        description: 'Monthly metrics and conversion rate are generated from one option builder.',
        ariaLabel: 'Monthly revenue, active users, and conversion rate chart',
        fallbackDescription:
          'A combined bar and line chart comparing monthly product metrics.',
      },
      implementationTrend: {
        title: 'Portfolio Chart Trend',
        description:
          'Previous and current values are compared with review scores, while longer data can be explored with dataZoom.',
        ariaLabel: 'Portfolio chart implementation trend chart',
        fallbackDescription:
          'A mixed chart comparing previous and current values with review scores as a line.',
      },
      qualityScatter: {
        title: 'Quality Scatter',
        description:
          'Cycle time, defect rate, and complexity are compared with a scatter chart and visualMap.',
        ariaLabel: 'Feature quality and complexity scatter chart',
        fallbackDescription:
          'A scatter chart comparing each feature by cycle time, defect rate, and complexity.',
      },
      genderBoxPlot: {
        title: 'Gender Box Plot',
        description:
          'A dummy boxplot example comparing distributions by gender and age group with outlier points.',
        ariaLabel: 'Gender and age group distribution boxplot chart',
        fallbackDescription:
          'A boxplot chart comparing minimum, quartiles, median, maximum, and outliers by gender and age group.',
      },
      capabilityTreemap: {
        title: 'Capability Treemap',
        description:
          'A treemap example that reshapes the chart archive by implementation area and relative weight.',
        ariaLabel: 'Portfolio visualization capability treemap',
        fallbackDescription:
          'A treemap showing the share of ECharts, markup charts, and shared UX work.',
      },
      categoryShare: {
        title: 'Pie Chart',
        description: 'A pie chart with legend and labels summarizes the chart example mix.',
        ariaLabel: 'Chart category share pie chart',
        fallbackDescription: 'A donut chart showing the share of chart example categories.',
      },
      sankey: {
        title: 'Custom Component + Sankey Flow',
        description:
          'The flow separates left and right status bars, transition lines, legend, and values into a custom component.',
      },
    },
    chartOptions: {
      businessTrend: {
        revenueIndex: 'Revenue index',
        activeUsers: 'Active users',
        conversionRate: 'Conversion rate',
        revenueAxis: 'Revenue',
        conversionAxis: 'Conversion',
      },
      implementationTrend: {
        previous: 'Previous',
        current: 'Current',
        reviewScore: 'Review score',
        casesAxis: 'Cases',
        reviewAxis: 'Review',
      },
      qualityScatter: {
        cycleTimeAxis: 'Cycle time',
        defectRateAxis: 'Defect rate',
        complexityHigh: 'High complexity',
        complexityLow: 'Low',
        seriesName: 'Feature quality',
      },
      genderBoxPlot: {
        valueAxis: 'Value',
        seriesName: 'Gender distribution',
        numberLocale: 'en-US',
        genderLabels: {
          Male: 'Male',
          Female: 'Female',
        },
        statsLabels: {
          min: 'Min',
          q1: 'Q1',
          median: 'Median',
          q3: 'Q3',
          max: 'Max',
          outlier: 'Outlier',
        },
      },
      categoryShare: {
        centerLabel: 'Example',
        seriesName: 'Chart archive',
        numberLocale: 'en-US',
      },
    },
    sankey: {
      ariaLabel: 'Year over year status transition sankey chart',
      legendLabel: 'Sankey legend',
      fallbackDescription:
        'A flow chart showing how 2024 A, C, and D2 statuses move into 2025 A, C, and D2 statuses.',
      previousYear: '2024',
      currentYear: '2025',
      unitLabel: '(people)',
      numberLocale: 'en-US',
      nodeLabels: {
        A: 'Good',
        C: 'Normal',
        D2: 'Poor',
        'A-1': 'Good',
        'C-1': 'Normal',
        'D2-1': 'Poor',
      },
      legendItems: {
        veryImproved: 'Greatly improved',
        improved: 'Improved',
        noChange: 'No change',
        worsened: 'Worsened',
        veryWorsened: 'Greatly worsened',
      },
    },
    timeline: {
      editorLabel: 'Timeline item edit list',
      editorTitle: 'Timeline Items',
      editorDescription: 'Edit title, group, dates, status, and visibility from the left list.',
      visibleLabel: 'Visible',
      titleLabel: 'Title',
      groupLabel: 'Group',
      statusLabel: 'Status',
      startLabel: 'Start',
      endLabel: 'End',
      progressLabel: 'Progress',
      shellLabel: 'Portfolio roadmap timeline',
      summary: (visibleCount, groupCount) =>
        `${visibleCount} visible items / ${groupCount} groups`,
      zoomControlsLabel: 'Timeline zoom controls',
      zoomInLabel: 'Zoom In',
      zoomOutLabel: 'Zoom Out',
      resetLabel: 'Reset',
      sidebarLabel: 'Group',
      momentLocale: 'en',
      markerLabels: {
        now: 'Now',
        today: 'Today',
      },
      statusLabels: {
        done: 'Done',
        active: 'Active',
        planned: 'Planned',
      },
    },
    customGrid: {
      ariaLabel: 'Portfolio custom data grid',
      searchLabel: 'Search',
      searchPlaceholder: 'Search capability or task',
      categoryLabel: 'Category',
      allCategoriesLabel: 'All categories',
      selectedLabel: (count) => `${count} selected`,
      editModeLabel: 'Edit mode',
      editModeNote: 'Edit mode: update the list and save your changes.',
      cancelLabel: 'Cancel',
      saveLabel: 'Save',
      addRowLabel: 'Add',
      addChildLabel: 'Add',
      deleteSelectedLabel: 'Delete selected',
      newRowLabel: 'New',
      newChildLabel: 'New child',
      newRowPlaceholder: {
        capability: 'New capability',
        category: 'Category',
        owner: 'Owner',
        coverage: '0',
      },
      newChildPlaceholder: {
        name: 'Child task',
        owner: 'Owner',
      },
      clearLabel: 'Clear',
      expandLabel: 'Expand',
      collapseLabel: 'Collapse',
      selectAllLabel: 'Select all visible rows',
      selectRowLabel: (capability) => `Select ${capability}`,
      toggleRowLabel: (action, capability) => `${action} ${capability}`,
      headers: {
        capability: 'Capability',
        category: 'Category',
        owner: 'Owner',
        status: 'Status',
        coverage: 'Coverage',
        updated: 'Updated',
      },
      impactSuffix: 'impact',
      addedChildNote: 'Added in edit mode.',
      statusLabels: {
        Stable: 'Stable',
        Improving: 'Improving',
        Review: 'Review',
      },
      impactLabels: {
        High: 'High',
        Medium: 'Medium',
        Low: 'Low',
      },
    },
    dataGridCard: {
      title: 'Custom Data Grid',
      description:
        'A dummy-data reconstruction of AccordionTable and RealGrid patterns with search, sorting, filters, and selection.',
    },
    nav: [
      { id: 'home', label: 'Home', href: '#/', path: '/' },
      { id: 'charts', label: 'Charts', href: '#/charts', path: '/charts' },
      { id: 'data-grid', label: 'Data Grid', href: '#/data-grid', path: '/data-grid' },
      { id: 'timeline', label: 'Timeline', href: '#/timeline', path: '/timeline' },
    ],
    pages: {
      charts: {
        eyebrow: 'Charts Page',
        title: 'Validate chart implementation cases in one place',
        description:
          'Each example keeps the ECharts wrapper, option builder, i18n labels, legend state, and resize handling separated.',
      },
      dataGrid: {
        eyebrow: 'Data Grid Page',
        title: 'Inspect operational grid interactions separately',
        description:
          'Search, filtering, sorting, parent/child selection, and edit mode flows can be checked on a focused page.',
      },
      timeline: {
        eyebrow: 'Timeline Page',
        title: 'Show timeline editing and canvas interactions apart',
        description:
          'The editor panel and react-calendar-timeline canvas sit together so move, resize, and zoom flows are easy to verify.',
      },
    },
    demoRoutes: {
      eyebrow: 'Demo Routes',
      title: 'Feature Demo Pages',
      description:
        'The home page explains the project context while complex UI examples live on focused feature pages.',
      openLabel: 'Open page',
    },
    sections: {
      overview: {
        eyebrow: 'About',
        title: 'Project Overview',
        description:
          'The app reconstructs practical frontend patterns with dummy data only.',
      },
      skills: {
        eyebrow: 'Skill Summary',
        title: 'Core Capability Snapshot',
        description:
          'The structure highlights reusable UI, data shaping, chart abstraction, and API contract thinking.',
      },
      charts: {
        eyebrow: 'ECharts Showcase',
        title: 'ECharts Archive Demo',
        description:
          'Bar+line, dataZoom, scatter, boxplot, pie, treemap, and sankey examples share a wrapper and option-builder pattern.',
      },
      timeline: {
        eyebrow: 'Roadmap',
        title: 'react-calendar-timeline Editor',
        description:
          'Timeline items can be edited from the left list, zoomed, moved, and resized in the timeline shell.',
      },
      table: {
        eyebrow: 'Data Grid',
        title: 'Custom Data Grid',
        description:
          'A dummy portfolio data grid shows nested rows, search, filters, sorting, selection, and edit-mode flows.',
      },
    },
    tableHeaders: {
      project: 'Project',
      domain: 'Domain',
      status: 'Status',
      leadTime: 'Lead time',
      chartCoverage: 'Chart coverage',
      apiContract: 'API contract',
      updatedAt: 'Updated',
      leadTimeUnitLabel: 'd',
      statusLabels: {
        Stable: 'Stable',
        Improving: 'Improving',
        Watch: 'Watch',
      },
    },
  },
};
