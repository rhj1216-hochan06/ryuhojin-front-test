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
- `src/features/charts`: chart wrapper, option builder, chart-specific UI
- `src/features/timeline`: react-calendar-timeline 예제와 스타일
- `src/hooks`: mock API 호출, 데이터 가공, 화면 상태 훅
- `src/i18n`: 간단한 dictionary 기반 i18n 구조
- `src/mocks`: 실제 서버를 대체하는 dummy data와 mock API
- `src/types`: 화면/도메인 데이터 타입
- `src/styles`: 전역 스타일과 디자인 토큰

## Component Rules

- 컴포넌트는 화면 책임과 데이터 가공 책임을 섞지 않는다.
- section 컴포넌트는 조립과 표시를 담당하고, 데이터 fetch/transform은 hook으로 분리한다.
- 공통 UI는 `Card`, `Section`, `AppLayout`처럼 작은 단위로 유지한다.
- 버튼은 `type`을 명시하고, 필요한 경우 `aria-label`을 제공한다.

## TypeScript Rules

- `any` 사용을 피하고 도메인 타입을 `src/types`에 정의한다.
- mock API 응답도 명확한 제네릭/응답 타입을 가진다.
- 차트 option builder의 입력과 출력은 명확히 타입을 지정한다.

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
