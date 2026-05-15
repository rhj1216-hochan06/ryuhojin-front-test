# AGENTS.md

## Project Purpose

이 프로젝트는 React + TypeScript 기반의 실무형 포트폴리오 데모 앱이다.

실제 회사 코드나 운영 데이터는 포함하지 않는다. 실무 프로젝트 경험을 바탕으로 화면 구조, 데이터 흐름, 차트 구성, API 연동 방식 등을 재구성한 더미 예시만 사용한다.

이 프로젝트에서 보여줄 핵심 역량은 다음과 같다.

- React + TypeScript 기반 화면 구성
- API 호출, 응답 정규화, React Query 연동 흐름
- ECharts option builder 분리와 차트 구조화
- mock API 기반의 실무형 데이터 흐름 구성
- 반응형 UI와 접근성 고려
- 포트폴리오용 README 문서화

## Tech Stack

- React + TypeScript + Create React App
- React Scripts
- Axios
- TanStack React Query
- ECharts
- react-calendar-timeline
- styled-components
- CSS modules/global CSS
- Promise 기반 mock API

## Folder Responsibilities

- `src/pages`: 라우트 단위 페이지 컴포넌트
- `src/components/common`: 도메인에 묶이지 않는 재사용 UI 원자, 예: `Card`, `Dialog`, `Section`, floating button
- `src/components/sections`: 페이지 또는 대시보드 section 조립 컴포넌트
- `src/components/layout`: 앱 전체 레이아웃 컴포넌트
- `src/features`: 특정 기능이나 도메인에 묶인 UI, option builder, feature 전용 로직
- `src/features/charts`: 차트 wrapper, chart module, option builder, chart-specific UI
- `src/features/timeline`: react-calendar-timeline 예제와 스타일
- `src/features/dataGrid`: data grid, infinite render table 등 표 기능
- `src/apis`: 외부 API별 호출 함수, 응답 정규화, 화면용 API 타입
- `src/query`: React Query 공통 설정과 API별 query hook
- `src/hooks`: mock API 호출, 데이터 가공, 화면 상태 hook
- `src/i18n`: dictionary 기반 i18n 구조
- `src/mocks`: 실제 서버를 대체하는 dummy data와 mock API
- `src/types`: 화면/도메인 데이터 타입
- `src/styles`: 전역 스타일과 디자인 토큰
- `src/utils`: axios 공통 설정, API error normalization, 공통 utility
- `src/assests/data`: 관광 API 매뉴얼 기반 TS 메타데이터와 코드표 데이터

`src/assests`는 현재 프로젝트에 이미 존재하는 폴더명이다. 단순 오타처럼 보여도 요청 없이 `assets`로 폴더명을 바꾸지 않는다.

## Work Process Rules

작업을 시작하기 전에 요청과 관련된 범위부터 확인한다.

- `AGENTS.md`
- `package.json`
- 요청과 관련된 source file
- 관련 hook, type, api, query, mock data
- 기존에 같은 패턴으로 구현된 컴포넌트 또는 기능

프로젝트 전체를 무조건 탐색하지 않는다. 관련 파일을 먼저 파악하고, 필요한 경우에만 탐색 범위를 넓힌다.

수정은 요청 범위 안에서 최소화한다. 요청하지 않은 구조 변경, 스타일 변경, 폴더 이동, 라이브러리 교체, 대규모 리팩터링은 하지 않는다.

작업 중 발견한 기존 변경사항은 사용자의 변경으로 간주한다. 관련 없는 변경은 건드리지 않고, 같은 파일의 변경은 되돌리지 말고 그 위에서 조심스럽게 이어서 수정한다.

## Git Workflow Rules

사용자가 커밋 또는 푸시를 요청하면 최근 커밋 로그를 먼저 확인하고, 기존 프로젝트의 커밋 메시지 스타일을 따른다.

사용자가 기준 브랜치를 명시하지 않으면 원격 기본 브랜치 또는 현재 프로젝트 관례를 확인해 `main` 또는 `develop` 중 하나를 기준 브랜치로 사용한다.

푸시는 아래 흐름을 따른다.

```bash
git fetch origin
git pull origin <base-branch>
git merge <base-branch> --no-edit
git push origin <work-branch>
```

작업 브랜치와 기준 브랜치가 같으면 merge 단계는 결과적으로 no-op이 될 수 있다. 충돌이 발생하면 임의로 덮어쓰지 말고 충돌 파일을 확인한 뒤 해결한다.

빌드 산출물, lockfile, 설정 파일은 실제 변경 의도가 있을 때만 커밋한다.

## Agent Command Format

코드 수정, 기능 구현, 리팩터링, 버그 수정, 테스트 작성 요청이 들어오면 작업 전에 짧게 아래 내용을 정리하고 진행한다.

목표:
- 원하는 결과

범위:
- 수정할 파일 또는 기능 범위

제약:
- 지켜야 할 규칙

검증:
- 빌드, 테스트, 수동 확인 방법

단순 개념 설명, 명령어 안내, 에러 원인 설명처럼 코드 수정이 없는 요청은 위 형식을 생략할 수 있다.

## Component Boundary Rules

`src/components/common`과 `src/features`는 합치지 않는다.

- `src/components/common`: 여러 화면에서 재사용 가능한 도메인 독립 UI만 둔다.
- `src/features`: 특정 기능의 데이터 구조, option builder, 비즈니스 표시 규칙을 알고 있는 컴포넌트를 둔다.
- feature 컴포넌트가 두 개 이상의 기능에서 반복되고 도메인 의존성이 사라졌을 때만 common으로 승격한다.
- common 컴포넌트에는 관광 API, chart option, timeline data 같은 feature-specific 의존성을 넣지 않는다.

## Component Rules

- 컴포넌트는 화면 책임과 데이터 가공 책임을 섞지 않는다.
- section 컴포넌트는 조립과 표시를 담당한다.
- 데이터 fetch, transform, 필터링, 정렬은 가능한 hook 또는 utility로 분리한다.
- 기존 공통 컴포넌트가 있으면 새 컴포넌트를 만들기 전에 재사용 가능 여부를 먼저 확인한다.
- 버튼은 `type`을 명시한다.
- 아이콘 버튼이나 의미가 불명확한 버튼에는 `aria-label`을 제공한다.
- UI 텍스트, 스타일, 레이아웃은 기존 프로젝트 톤을 유지한다.

## TypeScript Rules

- `any` 사용을 피한다.
- 도메인 타입은 가능한 `src/types` 또는 해당 domain type 파일에 정의한다.
- mock API 응답도 명확한 제네릭/응답 타입을 가진다.
- 차트 option builder의 입력과 출력은 명확히 타입을 지정한다.
- 타입 에러를 우회하기 위한 불필요한 type assertion은 피한다.
- 기존 타입 구조가 있으면 새 타입을 만들기 전에 재사용 가능 여부를 확인한다.

## API Structure Rules

- API 호출 함수는 `src/apis/<domain>`에 둔다.
- React 컴포넌트에서 axios를 직접 호출하지 않는다.
- API 계층은 호출, 응답 정규화, 화면용 타입 변환을 담당한다.
- UI 컴포넌트는 API 원본 응답 구조에 직접 의존하지 않는다.
- API 에러는 `src/utils/apiError.ts`의 `normalizeApiRequestError`로 정규화한 뒤 UI에 전달한다.
- query key는 API 목적과 주요 파라미터를 포함한다.
- React Query 공통 옵션은 `src/query/config.ts`의 `configDefaults`를 사용한다.
- `configDefaults` 변경 시 각 옵션의 의도를 주석으로 남긴다.

현재 React Query 기본 정책은 다음과 같다.

- 실패 자동 재시도 없음
- window focus 재요청 없음
- `staleTime` 5분
- `gcTime` 10분

## Tourism API Rules

한국관광공사 관광 API는 `src/apis/tourism/tourism.ts`에서 호출과 정규화를 담당한다.

신청된 주요 endpoint 메타데이터는 `src/assests/data/tourismApiManual.ts`에 유지한다.

- `KorService2/searchKeyword2`
- `KorService2/searchFestival2`
- `KorService2/searchStay2`
- `KorService2/detailCommon2`
- `KorService2/detailImage2`
- `KorService2/areaBasedList2`
- `KorService2/ldongCode2`

검색 목록은 `KorService2/searchKeyword2`를 사용한다. 결과 카드 선택 시 `contentId`로 `KorService2/detailCommon2`를 추가 호출해 다이얼로그 상세 정보를 채운다.

API 매뉴얼 docx 원문을 화면 코드에서 직접 파싱하지 않는다. 필요한 endpoint, request parameter, response field 정보는 TS 메타데이터로 옮겨 사용한다.

`detailCommon2` 상세 응답의 `overview`, `homepage`, `tel`, `telname`, `zipcode`, `createdtime`, `modifiedtime`, `firstimage`, `firstimage2` 등은 API 계층에서 화면용 타입으로 정규화한다.

상세 다이얼로그의 정보 표시 순서는 다음을 기본으로 한다.

- 주소
- 콘텐츠 타입, 분류체계
- 개요
- 좌표, 우편번호
- 전화번호, 등록일
- 홈페이지

콘텐츠 ID, 이미지 저작권, 지도 레벨은 기본 상세 화면에 표시하지 않는다.

날짜는 연/월/일까지만 표시한다. 등록일과 최근 갱신일 모두 연도를 포함한다.

`homepage`는 HTML anchor 또는 일반 텍스트 URL이 섞여 올 수 있다.

- `<a href="...">label</a>` 형태는 anchor의 label과 href를 우선 사용한다.
- 일반 텍스트의 여러 URL은 주변 텍스트를 기준으로 `label/url` 쌍을 만든다.
- `비짓서울 https://...국가유산청 https://...`처럼 label과 URL이 붙어 오는 경우에도 앞뒤 label이 서로 뒤바뀌지 않게 처리한다.
- UI에서는 각 홈페이지 항목을 개별 클릭 가능한 링크로 렌더링한다.

상세 다이얼로그 이미지 영역은 이미지 원본 비율과 크기에 상관없이 좌측 media 영역의 배경색이 전체 높이를 유지해야 한다. 이미지는 깨지거나 잘리지 않도록 `object-fit`과 컨테이너 높이 처리를 함께 확인한다.

정적 배포에서는 `REACT_APP_DATA_GO_KR_SERVICE_KEY`가 프론트 번들에 포함될 수 있다. 실제 서비스에서는 serverless proxy 등 서버 측 경유 구조를 사용한다.

## Chart Rules

- ECharts option은 컴포넌트 내부에 길게 작성하지 않는다.
- option 생성은 chart module의 `option.ts` 또는 feature-level builder 함수로 분리한다.
- chart data, transform hook, option builder, chart UI를 각각 분리한다.
- 차트 컴포넌트는 데이터 표시 책임에 집중한다.
- chart wrapper는 resize 이벤트를 처리한다.
- chart가 없거나 데이터가 비어 있을 때 접근 가능한 fallback 설명을 제공한다.
- 차트 option 수정 시 기존 차트들의 공통 builder 패턴을 먼저 확인한다.
- 단일 차트만을 위한 임시 로직을 공통 builder에 무리하게 넣지 않는다.

## Timeline Rules

- react-calendar-timeline 데이터는 실제 프로젝트 일정이 아닌 더미 roadmap 데이터만 사용한다.
- timeline 주변 UI 스타일은 styled-components로 구현한다.
- timeline 스타일과 전역 레이아웃 스타일의 역할을 섞지 않는다.
- timeline 데이터 구조를 수정할 때는 관련 타입과 mock data를 함께 확인한다.

## Accessibility And Responsive Checks

- 의미 있는 heading 순서를 유지한다.
- 차트와 timeline에는 설명 텍스트 또는 `aria-label`을 제공한다.
- 모바일에서는 카드, 차트, 테이블이 가로 넘침 없이 읽혀야 한다.
- 데이터 테이블은 작은 화면에서 가로 스크롤 컨테이너 안에 배치한다.
- 클릭 가능한 요소는 키보드 접근성과 포커스 상태를 고려한다.
- 외부 링크는 사용자가 링크임을 알 수 있게 표현한다.
- 툴팁, 다이얼로그, floating UI는 viewport 밖으로 어색하게 밀리지 않는지 확인한다.

## README Rules

README는 외부 포트폴리오 설명용 문서다.

README에는 반드시 다음 문구를 포함한다.

> 실제 프로젝트 경험을 바탕으로 재구성한 더미 예시이며, 실제 회사 데이터나 코드는 포함하지 않습니다.

README에는 다음 내용을 설명한다.

- 결과물 사이트 주소
- 프로젝트 목적
- 실행 방법
- 검증 명령어
- 핵심 기술 포인트
- 주요 폴더 구조
- 실제 프로젝트 경험을 어떻게 데모로 재구성했는지
- 배포 또는 빌드 결과 확인 방법

## Verification

작업 후 변경 범위에 맞춰 가능한 검증을 실행한다. 프로젝트에 정의되지 않은 script는 임의로 만들지 않는다.

```bash
npm run typecheck
npm run lint
npm run build
```

의존성이 없거나 lockfile이 바뀐 경우에만 `npm install`을 실행한다.

테스트가 필요한 변경이면 `npm test -- --watchAll=false` 실행을 검토한다.

CRA 기준 프로덕션 빌드 결과는 `build/` 폴더에 생성한다. 검증 명령어 실행이 불가능한 경우에는 어떤 명령을 실행하지 못했는지와 이유를 명확히 남긴다.
