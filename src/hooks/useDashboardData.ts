import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardPayload } from '../mocks/api';
import type { ApiResponse, DashboardPayload } from '../types/dashboard';

interface DashboardDataState {
  data: ApiResponse<DashboardPayload> | null;
  error: string | null;
  isLoading: boolean;
}

export const useDashboardData = () => {
  const [state, setState] = useState<DashboardDataState>({
    data: null,
    error: null,
    isLoading: true,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refresh = useCallback(() => {
    setRefreshIndex((current) => current + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    setState((current) => ({ ...current, error: null, isLoading: true }));

    fetchDashboardPayload()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setState({ data: response, error: null, isLoading: false });
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : 'Unknown dashboard data error';
        setState({ data: null, error: message, isLoading: false });
      });

    return () => {
      isMounted = false;
    };
  }, [refreshIndex]);

  return {
    ...state,
    refresh,
  };
};

