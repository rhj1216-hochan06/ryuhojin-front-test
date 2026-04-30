# Frontend Portfolio Dashboard

Notion Portfolio: https://www.notion.so/329efa9a0f5f805ab6ecc52d4266a590

React + TypeScript 기반의 실무형 포트폴리오 데모 앱입니다. 차트, 일정, 데이터 그리드처럼 운영 화면에서 자주 만나는 복합 UI를 dummy data로 재구성하고, mock API부터 화면 표시까지의 흐름을 분리해 구현했습니다.

> 실제 프로젝트 경험을 바탕으로 재구성한 더미 예시이며, 실제 회사 데이터나 실제 회사 코드는 포함하지 않습니다.

## 해결하려는 문제

실무형 포트폴리오는 단순 소개 화면만으로는 컴포넌트 설계, 데이터 가공, 차트 공통화, 접근성, 반응형 대응 역량을 보여주기 어렵습니다. 이 프로젝트는 실제 서비스 데이터를 사용하지 않고도 아래 역량이 보이도록 구성했습니다.

- API 응답을 화면에서 바로 쓰지 않고 hook과 view model을 거쳐 가공하는 구조
- ECharts option builder, chart wrapper, chart UI의 책임 분리
- 검색, 필터, 정렬, 선택, 확장 행, 편집 흐름을 포함한 custom data grid
- react-calendar-timeline 기반의 일정 편집, 이동, resize, zoom 흐름
- dictionary 기반 i18n copy 관리와 locale별 날짜/숫자/상태 라벨 처리
- 모바일에서 차트, timeline, table이 가로 넘침 없이 읽히도록 하는 레이아웃

## 구현 방식

### 페이지 구조

메인 페이지는 프로젝트 맥락, 핵심 역량, 기능별 데모 진입점을 보여주고, 복잡한 화면은 hash route 기반의 별도 페이지로 분리했습니다. CRA 정적 배포에서 새로고침 404 위험을 줄이기 위해 별도 라우팅 패키지를 추가하지 않고 `#/charts`, `#/data-grid`, `#/timeline` 구조를 사용합니다.

### 데이터 흐름

`src/mocks/api.ts`는 Promise 기반 mock API를 제공하고, `useDashboardData`가 로딩/에러/refresh 상태를 관리합니다. 화면에서 필요한 파생 정보는 `useDashboardViewModel`과 feature hook에서 가공해 section 컴포넌트로 전달합니다.

### 차트 구조

ECharts 인스턴스 생성, resize, dispose는 `EChart` wrapper가 담당합니다. 차트별 option은 `src/features/charts/chartOptions.ts`의 builder 함수로 분리해 컴포넌트 내부에 긴 option 객체가 쌓이지 않도록 했습니다.

구현된 예제:

- Bar + Line 복합 차트
- dataZoom을 포함한 전년도 비교 복합 차트
- Scatter 기반 품질/복잡도 비교 차트
- Boxplot 기반 성별/그룹별 분포 비교 차트
- Pie 기반 카테고리 분포 차트
- Treemap 기반 구현 영역 차트
- 커스텀 UI와 결합한 Sankey flow 차트

### Timeline 구조

`react-calendar-timeline`을 사용해 roadmap dummy data를 표시합니다. 왼쪽 편집 패널에서 제목, 그룹, 기간, 상태, 표시 여부를 수정할 수 있고, timeline에서는 item move, resize, zoom/reset 흐름을 확인할 수 있습니다.

### Custom Data Grid 구조

RealGrid/AccordionTable에서 자주 다루는 흐름을 dummy portfolio data로 재구성했습니다. 검색, 카테고리 필터, 정렬, parent/child 선택, 확장/접기, 편집 모드의 행/하위 작업 추가와 삭제를 포함합니다.

### i18n 구조

화면 copy는 `src/i18n/dictionary.ts`에 모아 관리합니다. hero, chart 설명, Sankey 라벨, timeline 상태, grid 상태/impact, table 상태, 날짜/숫자 formatter locale을 dictionary에서 전달해 한국어/영어 전환 시 하드코딩 문구가 남지 않도록 했습니다.

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
    charts/      # ECharts wrapper, option builder, chart-specific UI
    dataGrid/    # Custom Data Grid 예제
    timeline/    # react-calendar-timeline 예제
  hooks/         # mock API 호출과 view model 가공
  i18n/          # dictionary 기반 다국어 copy
  mocks/         # dummy data와 Promise 기반 mock API
  pages/         # hash route별 페이지 조립 컴포넌트
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

수동 확인 포인트:

- `#/`, `#/charts`, `#/data-grid`, `#/timeline` 이동과 새로고침 확인
- navigation active 상태와 `aria-current="page"` 확인
- 한국어/영어 locale 전환 시 hero, Sankey, timeline, grid, table copy 확인
- 브라우저 크기 변경 시 ECharts resize 확인
- timeline 항목 편집, 표시 토글, move, resize, zoom/reset 확인
- custom grid 검색, 필터, 정렬, 선택, 확장/접기, 편집/저장/취소 확인
- 모바일에서 카드, 차트, timeline, table의 가로 스크롤과 텍스트 겹침 확인

## 포트폴리오 설명 포인트

- mock API 응답을 직접 렌더링하지 않고 hook과 view model로 가공합니다.
- chart lifecycle과 option builder를 분리해 차트 공통화 경험을 보여줍니다.
- timeline과 custom grid는 단순 static UI가 아니라 실제 조작 가능한 상태 흐름을 포함합니다.
- dictionary 기반 i18n으로 화면 copy와 locale별 formatter를 컴포넌트 밖에서 관리합니다.
- README는 외부 설명용이고, `AGENTS.md`는 이후 AI Agent가 작업할 때 참고하는 내부 개발 규칙 문서입니다.
