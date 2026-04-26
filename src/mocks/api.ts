import { dashboardPayload } from './dashboardData';
import type { ApiResponse, DashboardPayload } from '../types/dashboard';

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

