# AGENTS.md

## Project Purpose

이 프로젝트는 React + TypeScript 기반의 실무형 포트폴리오 데모 앱이다. 실제 회사 코드나 데이터는 포함하지 않고, 실제 프로젝트 경험을 바탕으로 재구성한 더미 예시만 사용한다.

## Tech Stack

- React + TypeScript + Create React App
- React Scripts
- ECharts for chart rendering
- react-calendar-timeline for roadmap/timeline demo
- styled-components for the timeline showcase styling
- CSS modules/global CSS for general dashboard layout
- Promise 기반 mock API

## Folder Responsibilities

- `src/components`: 재사용 가능한 UI 컴포넌트와 dashboard section 컴포넌트
- `src/apis`: 외부 API별 호출 함수, 응답 정규화, 화면용 API 타입
- `src/query`: React Query 공통 설정과 API별 query hook
- `src/features/charts`: chart wrapper, option builder, chart-specific UI
- `src/features/timeline`: react-calendar-timeline 예제와 스타일
- `src/hooks`: mock API 호출, 데이터 가공, 화면 상태 훅
- `src/i18n`: 간단한 dictionary 기반 i18n 구조
- `src/mocks`: 실제 서버를 대체하는 dummy data와 mock API
- `src/types`: 화면/도메인 데이터 타입
- `src/styles`: 전역 스타일과 디자인 토큰
- `src/utils`: axios 공통 설정과 API error normalization
- `src/assests/data`: 관광 API 매뉴얼 기반 TS 메타데이터와 코드표 데이터

## Component Rules

- 컴포넌트는 화면 책임과 데이터 가공 책임을 섞지 않는다.
- section 컴포넌트는 조립과 표시를 담당하고, 데이터 fetch/transform은 hook으로 분리한다.
- 공통 UI는 `Card`, `Section`, `AppLayout`처럼 작은 단위로 유지한다.
- 버튼은 `type`을 명시하고, 필요한 경우 `aria-label`을 제공한다.

## TypeScript Rules

- `any` 사용을 피하고 도메인 타입을 `src/types`에 정의한다.
- mock API 응답도 명확한 제네릭/응답 타입을 가진다.
- 차트 option builder의 입력과 출력은 명확히 타입을 지정한다.

## API Structure Rules

- API 호출 함수는 `src/apis/<domain>`에 두고, React 컴포넌트에서 axios를 직접 호출하지 않는다.
- 한국관광공사 관광 API는 `src/apis/tourism/tourism.ts`에서 호출과 정규화를 담당한다.
- 검색 목록은 `KorService2/searchKeyword2`를 사용하고, 결과 카드 선택 시 `contentId`로 `KorService2/detailCommon2`를 추가 호출해 다이얼로그 상세 정보를 채운다.
- `detailCommon2` 상세 응답의 `overview`, `homepage`, `tel`, `telname`, `zipcode`, `createdtime`, `firstimage2` 등은 API 계층에서 화면용 타입으로 정규화한다.
- `homepage`는 HTML anchor 또는 일반 텍스트 URL이 섞여 올 수 있다. 여러 URL을 `label/url` 쌍으로 분리해 UI에서는 각각 클릭 가능한 링크로 렌더링한다.
- 관광 API 매뉴얼 기반 endpoint, request parameter, response field 메타데이터는 `src/assests/data/tourismApiManual.ts`에 유지한다. docx 원문을 직접 파싱하는 로직을 화면 코드에 넣지 않는다.
- 관광 API query hook은 `src/query/apiTest`에 두고, query key는 API 목적과 주요 파라미터를 포함한다.
- React Query 공통 옵션은 `src/query/config.ts`의 `configDefaults`를 사용한다. 현재 기본값은 실패 자동 재시도 없음, window focus 재요청 없음, `staleTime` 5분, `gcTime` 10분이다.
- API 에러는 `src/utils/apiError.ts`의 `normalizeApiRequestError`로 정규화한 뒤 UI에 전달한다.
- 정적 배포에서는 `REACT_APP_DATA_GO_KR_SERVICE_KEY`가 프론트 번들에 포함될 수 있으므로 실제 서비스에서는 serverless proxy 등 서버 측 경유 구조를 사용한다.

## Chart Rules

- ECharts option은 컴포넌트 내부에 길게 작성하지 않는다.
- option 생성은 `src/features/charts/chartOptions.ts` 같은 builder 함수로 분리한다.
- chart data, transform hook, option builder, chart UI를 각각 분리한다.
- chart wrapper는 resize 이벤트를 처리하고, chart가 없을 때 접근 가능한 fallback 설명을 제공한다.

## Timeline Rules

- react-calendar-timeline 데이터는 실제 프로젝트 일정이 아닌 더미 roadmap 데이터만 사용한다.
- timeline 주변 UI 스타일은 styled-components로 구현하되, 전역 레이아웃 스타일과 역할을 섞지 않는다.

## Accessibility And Responsive Checks

- 의미 있는 heading 순서를 유지한다.
- 차트와 timeline에는 설명 텍스트 또는 `aria-label`을 제공한다.
- 모바일에서는 카드/차트/테이블이 가로 넘침 없이 읽혀야 한다.
- 데이터 테이블은 작은 화면에서 가로 스크롤 컨테이너 안에 배치한다.

## README Rules

- README는 외부 포트폴리오 설명용 문서다.
- "실제 프로젝트 경험을 바탕으로 재구성한 더미 예시이며, 실제 회사 데이터나 코드는 포함하지 않는다"는 문구를 포함한다.
- 실행 방법, 검증 명령어, 핵심 기술 포인트, 폴더 구조를 설명한다.

## Verification

- `npm install`
- `npm run build`
- `npm run lint`
- `npm run typecheck`

CRA 기준 프로덕션 빌드 결과는 `build/` 폴더에 생성한다.
