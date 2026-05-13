import { QueryClient } from '@tanstack/react-query';
import { configDefaults } from './config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: configDefaults,
  },
});
