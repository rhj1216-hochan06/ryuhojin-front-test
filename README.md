# Frontend Portfolio Dashboard

Result Site: https://ryuhojintest.github.io/

Notion Portfolio: https://www.notion.so/329efa9a0f5f805ab6ecc52d4266a590

React + TypeScript 기반의 실무형 포트폴리오 데모 앱입니다. 차트, 일정, 데이터 그리드, 공공데이터 API 연동처럼 운영 화면에서 자주 만나는 복합 UI를 dummy data와 실제 OpenAPI로 재구성하고, API 호출부터 화면 표시까지의 흐름을 분리해 구현했습니다.

> 실제 프로젝트 경험을 바탕으로 재구성한 더미 예시이며, 실제 회사 데이터나 실제 회사 코드는 포함하지 않습니다.

## 해결하려는 문제

실무형 포트폴리오는 단순 소개 화면만으로는 컴포넌트 설계, 데이터 가공, 차트 공통화, 접근성, 반응형 대응 역량을 보여주기 어렵습니다. 이 프로젝트는 실제 서비스 데이터를 사용하지 않고도 아래 역량이 보이도록 구성했습니다.

- API 응답을 화면에서 바로 쓰지 않고 hook과 view model을 거쳐 가공하는 구조
- ECharts option builder, chart wrapper, chart UI의 책임 분리
- 검색, 필터, 정렬, 선택, 확장 행, 편집 흐름을 포함한 custom data grid
- react-calendar-timeline 기반의 일정 편집, 이동, resize, zoom 흐름
- 공공데이터포털 실제 OpenAPI 검색, 응답 정규화, 자동 페이지네이션, 상세 결과 표시
- dictionary 기반 i18n copy 관리와 locale별 날짜/숫자/상태 라벨 처리
- 모바일에서 차트, timeline, table이 가로 넘침 없이 읽히도록 하는 레이아웃

## 구현 방식

### 페이지 구조

메인 페이지는 해결하려는 화면 문제, 구현으로 보여주는 프론트엔드 역량, 기능별 데모 진입점을 나눠 보여주고, 복잡한 화면은 hash route 기반의 별도 페이지로 분리했습니다. CRA 정적 배포에서 새로고침 404 위험을 줄이기 위해 별도 라우팅 패키지를 추가하지 않고 `#/charts`, `#/data-grid`, `#/timeline`, `#/api-playground`, `#/works` 구조를 사용합니다.

`#/works` 페이지는 데모 앱의 역량 시연과 실제 배포 결과물을 분리해 보여주는 배포 작업물 카드 페이지입니다. 각 카드에는 사이트 설명, 역할 범위 초안, 사용 기술, 구현 포인트, 외부 링크, 스크린샷 상태를 정리했습니다.

### 데이터 흐름

`src/mocks/api.ts`는 Promise 기반 mock API를 제공하고, `useDashboardData`가 로딩/에러/refresh 상태를 관리합니다. API 테스트 페이지는 `utils/axios`, `src/apis`, `src/query`, `src/hooks` 단계를 거쳐 한국관광공사 OpenAPI 응답을 화면용 타입으로 정규화합니다. 화면에서 필요한 파생 정보는 `useDashboardViewModel`과 feature hook에서 가공해 section 컴포넌트로 전달합니다.

### 공공데이터 API 구조

`#/api-playground` 페이지는 한국관광공사 국문 관광정보 서비스_GW의 키워드 검색 API를 직접 호출합니다. 검색어, 응답 상태, 요청 ID, 응답 시간, 페이지네이션 결과, 이미지 fallback, 선택한 결과의 상세 정보를 한 화면에서 확인할 수 있습니다.

검색 목록은 `KorService2/searchKeyword2`를 사용하고, 결과 카드를 선택하면 해당 항목의 `contentId`로 `KorService2/detailCommon2`를 추가 호출해 다이얼로그 상세 정보를 채웁니다. 상세 응답의 `overview`, `homepage`, `tel`, `telname`, `zipcode`, `createdtime`, `firstimage2` 등은 `src/apis/tourism/tourism.ts`에서 화면용 타입으로 정규화합니다. `homepage` 값은 HTML anchor 또는 일반 텍스트 URL이 섞여 올 수 있어, 여러 URL을 `label/url` 쌍으로 분리해 각각 클릭 가능한 링크로 표시합니다.

React Query 설정은 `src/query/config.ts`의 `configDefaults`를 공유합니다. API 요청은 실패 시 자동 재시도하지 않고, 브라우저 포커스 복귀 시 자동 재요청하지 않으며, `staleTime` 5분과 `gcTime` 10분을 적용합니다.

GitHub Pages는 정적 배포 환경이라 인증키를 완전히 숨길 수 없습니다. 이 데모는 포트폴리오 검증 목적의 개발용 키를 `REACT_APP_DATA_GO_KR_SERVICE_KEY`로 주입해 사용하며, 실제 서비스에서는 Vercel/Netlify serverless proxy 같은 서버 측 경유 구조로 인증키를 보호해야 합니다.

### 차트 구조

ECharts 인스턴스 생성, resize, dispose는 `EChart` wrapper가 담당합니다. 차트별 option은 `src/features/charts/chartModules` 아래 chart module별 option builder로 분리해 컴포넌트 내부에 긴 option 객체가 쌓이지 않도록 했습니다.

구현된 예제:

- Bar + Line 복합 차트
- dataZoom을 포함한 전년도 비교 복합 차트
- Scatter 기반 품질/복잡도 비교 차트
- Boxplot 기반 성별/그룹별 분포 비교 차트
- Pie 기반 카테고리 분포 차트
- Treemap 기반 구현 영역 차트
- 커스텀 UI와 결합한 Sankey flow 차트

### Timeline 구조

`react-calendar-timeline`을 사용해 roadmap dummy data를 표시합니다. 왼쪽 편집 패널에서 제목, 그룹, 날짜/시간, 상태, 표시 여부를 수정할 수 있고, timeline에서는 item move, resize, zoom/reset 흐름을 확인할 수 있습니다. Timeline canvas와 편집 목록은 선택 상태를 양방향으로 동기화해 선택한 항목으로 스크롤/표시 범위가 이동합니다.

### Custom Data Grid 구조

RealGrid/AccordionTable에서 자주 다루는 흐름을 dummy portfolio data로 재구성했습니다. 검색, 카테고리 필터, 정렬, parent/child 선택, 확장/접기, 편집 모드의 행/하위 작업 추가와 삭제를 포함합니다.

Data Grid 페이지 하단에는 무한 렌더링 시연용 테이블을 함께 배치했습니다. 별도 dummy data 파일의 60개 항목을 Promise 기반 mock API가 10개 단위로 반환하고, `IntersectionObserver`가 하단 sentinel을 감지하면 다음 페이지를 가져와 행을 추가합니다. 키보드 사용자를 위한 수동 더 불러오기 버튼도 제공합니다.

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
  apis/           # API별 타입과 호출 함수
  assests/
    data/         # 관광 API 매뉴얼 기반 TS 메타데이터와 코드표 원본
  components/
    common/      # Card, Section, Dialog 같은 공통 UI 컴포넌트
      Card/
      Dialog/
      FloatingRefreshButton/
      Section/
    layout/      # 앱 shell, header, navigation
    sections/    # overview, skills, charts, timeline, data table section
  features/
    charts/      # ECharts wrapper, option builder, chart-specific UI
    dataGrid/    # Custom Data Grid 예제
    timeline/    # react-calendar-timeline 예제
  hooks/         # mock API 호출과 view model 가공
  i18n/          # dictionary 기반 다국어 copy
  mocks/         # dummy data와 Promise 기반 mock API
  pages/         # hash route별 페이지 조립 컴포넌트
  query/         # React Query 설정과 페이지별 query hook
  styles/        # 전역 스타일과 dashboard UI 토큰
  types/         # 도메인 타입 정의
  utils/         # axios 공통 설정과 API error normalization
  App.tsx
  index.tsx
```

## 실행 방법

```bash
npm install
npm start
```

실제 공공데이터 API 검색을 사용하려면 로컬 `.env.dev`에 공공데이터포털 인증키를 설정합니다. `npm start`와 `npm run build`는 `.env.dev`가 있으면 자동으로 로드합니다.

```bash
REACT_APP_DATA_GO_KR_SERVICE_KEY=발급받은_인증키
```

`.env.dev`는 git에 포함하지 않습니다. 배포 시에는 GitHub Actions 또는 로컬 빌드 환경에서 동일한 환경변수를 주입해야 합니다.

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

- `#/`, `#/charts`, `#/data-grid`, `#/timeline`, `#/api-playground`, `#/works` 이동과 새로고침 확인
- navigation active 상태와 `aria-current="page"` 확인
- 배포 작업물 카드 2개 표시, 외부 링크 새 탭 열림, 링크 미확인 카드의 비활성 상태 확인
- 한국어/영어 locale 전환 시 hero, Sankey, timeline, grid, table copy 확인
- 브라우저 크기 변경 시 ECharts resize 확인
- timeline 항목 시간대 편집, 표시 토글, 선택 동기화, move, resize, zoom/reset 확인
- custom grid 검색, 필터, 정렬, 선택, 확장/접기, 편집/저장/취소 확인
- data grid 하단 테이블에서 스크롤 하단 도달 또는 더 불러오기 버튼으로 다음 더미 항목 추가 확인
- API 테스트 페이지에서 관광정보 키워드 검색, 이미지 fallback, 응답 시간, 결과 카드 선택, 상세 결과 표시, 스크롤 하단 자동 조회 확인
- API 결과 카드 선택 시 `detailCommon2` 상세 조회, 개요/홈페이지 링크/전화번호/등록일/우편번호 표시, 좌측 이미지 영역 배경 유지 확인
- 모바일에서 카드, 차트, timeline, table의 가로 스크롤과 텍스트 겹침 확인

## 포트폴리오 설명 포인트

- mock API 응답을 직접 렌더링하지 않고 hook과 view model로 가공합니다.
- axios 공통 설정, API 호출부, React Query hook, 화면 hook, UI를 분리해 실제 공공데이터 검색과 실패/페이지네이션/상세 선택 상태를 명확히 처리합니다.
- 공공데이터포털 실제 OpenAPI 응답을 화면용 타입으로 정규화하고, 정적 배포의 인증키 노출 한계를 문서화했습니다.
- chart lifecycle과 option builder를 분리해 차트 공통화 경험을 보여줍니다.
- timeline과 custom grid는 단순 static UI가 아니라 실제 조작 가능한 상태 흐름을 포함합니다.
- infinite scroll 테이블은 mock API pagination, loading/end state, 수동 load more fallback을 보여줍니다.
- dictionary 기반 i18n으로 화면 copy와 locale별 formatter를 컴포넌트 밖에서 관리합니다.
- 메인 페이지에서 화면 문제와 구현 역량을 분리해 포트폴리오 방문자가 데모의 목적을 빠르게 이해하도록 구성했습니다.
- 배포 작업물 페이지를 분리해 데모 앱은 역량 시연, 배포 사이트는 실제 결과물이라는 역할을 명확히 했습니다.
- README는 외부 설명용이고, `AGENTS.md`는 이후 AI Agent가 작업할 때 참고하는 내부 개발 규칙 문서입니다.
