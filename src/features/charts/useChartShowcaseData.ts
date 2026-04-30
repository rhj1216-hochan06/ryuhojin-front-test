import { useMemo } from 'react';
import type { DashboardPayload } from '../../types/dashboard';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const withRandomOffset = (value: number, maxOffset: number) =>
  value + (Math.random() * 2 - 1) * maxOffset;

export const useChartShowcaseData = (
  payload: DashboardPayload,
  refreshKey = 0,
) =>
  useMemo(() => {
    void refreshKey;

    return {
      businessTrend: payload.monthlyMetrics.map((metric) => ({
        ...metric,
        revenue: Math.round(clamp(withRandomOffset(metric.revenue, 8), 20, 240)),
        activeUsers: Math.round(clamp(withRandomOffset(metric.activeUsers, 5), 5, 150)),
        conversionRate: Number(
          clamp(withRandomOffset(metric.conversionRate, 0.5), 1.2, 20).toFixed(1),
        ),
      })),
      implementationTrend: payload.chartImplementationMetrics.map((metric) => ({
        ...metric,
        current: Math.round(clamp(withRandomOffset(metric.current, 10), 20, 220)),
        previous: Math.round(clamp(withRandomOffset(metric.previous, 10), 20, 220)),
        reviewScore: Math.round(clamp(withRandomOffset(metric.reviewScore, 5), 60, 100)),
      })),
      capabilityTree: payload.chartCapabilityTree.map((node) => ({
        ...node,
        value: Math.round(clamp(withRandomOffset(node.value, 8), 4, 140)),
        children: node.children?.map((child) => ({
          ...child,
          value: Math.round(clamp(withRandomOffset(child.value, 4), 2, 100)),
        })),
      })),
      categoryShare: payload.chartCategoryShare.map((share) => ({
        ...share,
        value: Math.round(clamp(withRandomOffset(share.value, 5), 1, 100)),
      })),
      qualityDistribution: payload.qualityPoints.map((point) => ({
        ...point,
        cycleTimeDays: Math.round(clamp(withRandomOffset(point.cycleTimeDays, 2), 1, 20)),
        defectRate: Number(clamp(withRandomOffset(point.defectRate, 0.45), 0.3, 10).toFixed(1)),
        complexity: Math.round(clamp(withRandomOffset(point.complexity, 1.2), 1, 10)),
      })),
      genderBoxPlot: payload.genderBoxPlotMetrics.map((metric) => ({
        ...metric,
        values: metric.values.map((value) =>
          Math.round(clamp(withRandomOffset(value, 3), 0, 160)),
        ),
      })),
      workflow: {
        ...payload.workflow,
        links: payload.workflow.links.map((link) => ({
          ...link,
          value: Math.round(clamp(withRandomOffset(link.value, 180), 0, 5000)),
        })),
      },
    };
  }, [payload, refreshKey]);
