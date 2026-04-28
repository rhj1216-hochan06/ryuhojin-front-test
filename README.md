# Frontend Portfolio Dashboard

React + TypeScript 기반의 실무형 포트폴리오 데모 앱입니다. 단순 소개 페이지가 아니라 mock API, custom hook, ECharts option builder, 데이터 테이블, timeline 예제를 포함한 동작 가능한 대시보드 형태로 구성했습니다.

> 실제 프로젝트 경험을 바탕으로 재구성한 더미 예시이며, 실제 회사 데이터나 실제 회사 코드는 포함하지 않습니다.

## 주요 구현 포인트

- React 컴포넌트 책임 분리: layout, section, card, chart wrapper 분리
- TypeScript 도메인 타입 설계: dashboard payload, API response, chart/timeline/table 데이터 타입 정의
- ECharts 차트 예제 구현
  - 복합 Bar + Line 차트
  - dataZoom을 포함한 전년도 비교 복합 차트
  - Pie 기반 차트 분포 차트
  - Treemap 기반 구현 영역 차트
  - Sankey 기반 데이터 흐름 차트
- 차트 option builder 분리: 컴포넌트 내부에 긴 option을 직접 작성하지 않음
- Promise 기반 mock API와 custom hook 데이터 가공 구조
- dictionary 기반 i18n 구조
- react-calendar-timeline + styled-components 기반 편집형 일정/로드맵 예제
- 검색, 필터, 정렬, 선택, 확장 행을 포함한 Custom Data Grid 예제
- 반응형 dashboard UI와 모바일 차트/타임라인/테이블 스크롤 처리

## 기술 스택

- React
- TypeScript
- Create React App
- React Scripts
- ECharts
- react-calendar-timeline
- styled-components
- ESLint

## 폴더 구조

```text
public/
  index.html

src/
  components/
    layout/      # 앱 shell, header, navigation
    sections/    # overview, skills, charts, timeline, data table section
    ui/          # Card, Section, MetricCard 같은 공통 UI
  features/
    charts/      # ECharts wrapper, option builder, chart data hook
    dataGrid/    # Custom Data Grid 예제
    timeline/    # react-calendar-timeline 예제
  hooks/         # mock API 호출과 view model 가공
  i18n/          # dictionary 기반 다국어 copy
  mocks/         # dummy data와 Promise 기반 mock API
  styles/        # 전역 스타일과 dashboard UI 토큰
  types/         # 도메인 타입 정의
  App.tsx
  index.tsx
```

## 실행 방법

```bash
npm install
npm start
```

## 프로덕션 빌드

Create React App 방식으로 빌드 산출물은 `build/` 폴더에 생성됩니다.

```bash
npm run build
```

## 테스트와 검증

```bash
npm test
npm run lint
npm run typecheck
```


## 포트폴리오 설명 포인트

- 차트 컴포넌트는 `EChart` wrapper가 lifecycle과 resize를 담당하고, 각 차트 option은 `chartOptions.ts`에서 생성합니다.
- 화면은 mock API 응답을 직접 사용하지 않고 `useDashboardData`, `useDashboardViewModel`, `useChartShowcaseData`를 거쳐 표시합니다.
- timeline 예제는 `react-calendar-timeline`을 사용하고, 왼쪽 리스트 편집, 확대/축소, item move/resize 흐름을 포함합니다.
- Custom Data Grid는 포트폴리오의 RealGrid/AccordionTable 경험을 더미 데이터로 재구성한 예제입니다.
- README는 외부 설명용이고, `AGENTS.md`는 이후 AI Agent가 작업할 때 참고하는 내부 개발 규칙 문서입니다.
