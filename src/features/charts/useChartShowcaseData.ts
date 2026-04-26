import { useMemo } from 'react';
import type { DashboardPayload } from '../../types/dashboard';

export const useChartShowcaseData = (payload: DashboardPayload) =>
  useMemo(
    () => ({
      businessTrend: payload.monthlyMetrics,
      qualityDistribution: payload.qualityPoints,
      workflow: payload.workflow,
    }),
    [payload],
  );

