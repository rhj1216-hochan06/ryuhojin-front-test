import { useMemo } from 'react';
import type { DashboardPayload } from '../../types/dashboard';

export const useChartShowcaseData = (payload: DashboardPayload) =>
  useMemo(
    () => ({
      businessTrend: payload.monthlyMetrics,
      implementationTrend: payload.chartImplementationMetrics,
      capabilityTree: payload.chartCapabilityTree,
      categoryShare: payload.chartCategoryShare,
      qualityDistribution: payload.qualityPoints,
      genderBoxPlot: payload.genderBoxPlotMetrics,
      workflow: payload.workflow,
    }),
    [payload],
  );
