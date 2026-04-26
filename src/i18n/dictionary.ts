import type { Locale, NavigationItem } from '../types/dashboard';

interface DashboardDictionary {
  appName: string;
  appSubtitle: string;
  nav: NavigationItem[];
  heroTitle: string;
  heroBody: string;
  languageLabel: string;
  refreshLabel: string;
  loading: string;
  errorTitle: string;
  sections: {
    overview: { eyebrow: string; title: string; description: string };
    skills: { eyebrow: string; title: string; description: string };
    charts: { eyebrow: string; title: string; description: string };
    timeline: { eyebrow: string; title: string; description: string };
    table: { eyebrow: string; title: string; description: string };
  };
  tableHeaders: {
    project: string;
    domain: string;
    status: string;
    leadTime: string;
    chartCoverage: string;
    apiContract: string;
    updatedAt: string;
  };
}

export const dictionary: Record<Locale, DashboardDictionary> = {
  ko: {
    appName: 'Frontend Portfolio Dashboard',
    appSubtitle: 'React + TypeScript 데이터 시각화 데모',
    heroTitle: '실무형 프론트엔드 역량을 한 화면에서 설명하는 데모 앱',
    heroBody:
      '차트 공통화, mock API, custom hook, timeline, 데이터 테이블을 분리된 구조로 구성한 포트폴리오용 대시보드입니다.',
    languageLabel: '언어 변경',
    refreshLabel: '데이터 새로고침',
    loading: '데이터를 불러오는 중입니다.',
    errorTitle: '데이터를 불러오지 못했습니다.',
    nav: [
      { id: 'overview', label: 'Overview', href: '#overview' },
      { id: 'skills', label: 'Skills', href: '#skills' },
      { id: 'charts', label: 'Charts', href: '#charts' },
      { id: 'timeline', label: 'Timeline', href: '#timeline' },
      { id: 'delivery', label: 'Delivery', href: '#delivery' },
    ],
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
        title: '차트 공통화 데모',
        description:
          '동일한 wrapper와 option builder 패턴으로 3가지 이상의 시각화를 구성했습니다.',
      },
      timeline: {
        eyebrow: 'Roadmap',
        title: 'react-calendar-timeline 일정 예제',
        description:
          '프로젝트 일정과 책임 구간을 styled-components 기반 컨테이너에서 표현합니다.',
      },
      table: {
        eyebrow: 'Data Grid',
        title: '전달 품질 테이블',
        description:
          'mock API 응답을 테이블 뷰로 표현하고 상태, 리드타임, 차트 커버리지를 비교합니다.',
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
    },
  },
  en: {
    appName: 'Frontend Portfolio Dashboard',
    appSubtitle: 'React + TypeScript data visualization demo',
    heroTitle: 'A working dashboard that explains practical frontend skills',
    heroBody:
      'A portfolio dashboard with separated chart options, mock APIs, custom hooks, timeline, and data-table structures.',
    languageLabel: 'Change language',
    refreshLabel: 'Refresh data',
    loading: 'Loading dashboard data.',
    errorTitle: 'Failed to load dashboard data.',
    nav: [
      { id: 'overview', label: 'Overview', href: '#overview' },
      { id: 'skills', label: 'Skills', href: '#skills' },
      { id: 'charts', label: 'Charts', href: '#charts' },
      { id: 'timeline', label: 'Timeline', href: '#timeline' },
      { id: 'delivery', label: 'Delivery', href: '#delivery' },
    ],
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
        title: 'Reusable Chart Demo',
        description:
          'Three visualization types share a wrapper and option-builder pattern.',
      },
      timeline: {
        eyebrow: 'Roadmap',
        title: 'react-calendar-timeline Example',
        description:
          'Project phases and ownership are shown inside a styled-components timeline shell.',
      },
      table: {
        eyebrow: 'Data Grid',
        title: 'Delivery Quality Table',
        description:
          'Mock API responses are presented as a comparison table for status, lead time, and chart coverage.',
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
    },
  },
};

