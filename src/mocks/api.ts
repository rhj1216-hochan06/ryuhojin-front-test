import { buildRoadmapItems, dashboardPayload } from './dashboardData';
import { infiniteRenderRows } from './infiniteRenderRows';
import type {
  ApiResponse,
  DashboardPayload,
  InfiniteRenderRow,
  PaginatedResponse,
} from '../types/dashboard';

const SIMULATED_LATENCY_MS = 280;

const buildPayloadSnapshot = (): DashboardPayload => {
  const minuteOffset = new Date().getMinutes() % 4;

  return {
    ...dashboardPayload,
    monthlyMetrics: dashboardPayload.monthlyMetrics.map((metric, index) => ({
      ...metric,
      activeUsers: metric.activeUsers + ((index + minuteOffset) % 3),
      conversionRate: Number((metric.conversionRate + minuteOffset * 0.1).toFixed(1)),
    })),
    roadmapItems: buildRoadmapItems(),
  };
};

export const fetchDashboardPayload = async (): Promise<ApiResponse<DashboardPayload>> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        status: 'success',
        data: buildPayloadSnapshot(),
        generatedAt: new Date().toISOString(),
        latencyMs: SIMULATED_LATENCY_MS,
      });
    }, SIMULATED_LATENCY_MS);
  });

export const fetchInfiniteRenderRows = async (
  page: number,
  pageSize: number,
): Promise<ApiResponse<PaginatedResponse<InfiniteRenderRow>>> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      const startIndex = Math.max(page - 1, 0) * pageSize;
      const items = infiniteRenderRows.slice(startIndex, startIndex + pageSize);

      resolve({
        status: 'success',
        data: {
          items,
          page,
          pageSize,
          total: infiniteRenderRows.length,
          hasNextPage: startIndex + pageSize < infiniteRenderRows.length,
        },
        generatedAt: new Date().toISOString(),
        latencyMs: SIMULATED_LATENCY_MS,
      });
    }, SIMULATED_LATENCY_MS);
  });
