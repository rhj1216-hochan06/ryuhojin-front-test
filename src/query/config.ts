export const configDefaults = {
  // API 요청 실패 시 자동 재시도하지 않고 현재 에러 상태를 그대로 노출합니다.
  retry: false,
  // 브라우저 창이 다시 포커스되어도 같은 데이터를 자동 재요청하지 않습니다.
  refetchOnWindowFocus: false,
  // 조회한 데이터를 5분 동안 fresh 상태로 간주해 불필요한 재요청을 줄입니다.
  staleTime: 5 * 60 * 1000,
  // 사용되지 않는 query 데이터를 10분 동안 캐시에 유지합니다.
  gcTime: 10 * 60 * 1000,
} as const;
