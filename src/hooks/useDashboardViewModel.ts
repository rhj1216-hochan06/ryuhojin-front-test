import { useMemo } from 'react';
import type { ApiResponse, DashboardPayload } from '../types/dashboard';

export const useDashboardViewModel = (
  response: ApiResponse<DashboardPayload> | null,
  dateTimeLocale: string,
) =>
  useMemo(() => {
    if (!response) {
      return null;
    }

    const latestMetric =
      response.data.monthlyMetrics[response.data.monthlyMetrics.length - 1];
    const averageConversion =
      response.data.monthlyMetrics.reduce(
        (total, metric) => total + metric.conversionRate,
        0,
      ) / response.data.monthlyMetrics.length;
    const stableDeliveries = response.data.deliveryRows.filter(
      (row) => row.status === 'Stable',
    ).length;

    return {
      payload: response.data,
      generatedAtLabel: new Intl.DateTimeFormat(dateTimeLocale, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(response.generatedAt)),
      summary: {
        latestActiveUsers: latestMetric.activeUsers,
        averageConversion: Number(averageConversion.toFixed(1)),
        stableDeliveries,
      },
    };
  }, [dateTimeLocale, response]);
