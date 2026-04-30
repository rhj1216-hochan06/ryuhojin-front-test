import type { InfiniteRenderRow, InfiniteRenderStatus } from '../types/dashboard';

const screenScenarios = [
  'Chart archive refresh',
  'Sankey flow recalculation',
  'Timeline visible range',
  'Data grid row chunk',
  'Locale copy snapshot',
  'Responsive table guard',
  'Boxplot tooltip batch',
  'Pie label adjustment',
  'Grid selection snapshot',
  'Infinite row append',
  'Mobile overflow check',
  'Fallback copy render',
  'Treemap dataset slice',
  'Timeline edit draft',
  'Grid filter result',
  'Last page boundary',
  'Keyboard load fallback',
  'Chart resize observer',
  'Grid edit draft save',
  'Dictionary label render',
];

const modules = [
  'ECharts wrapper',
  'Chart option builder',
  'Timeline transform',
  'Mock API page',
  'Dictionary lookup',
  'Layout QA',
  'Tooltip formatter',
  'Label layout',
  'Edit mode state',
  'IntersectionObserver',
  'Scroll container',
  'Accessible text',
];

const statuses: InfiniteRenderStatus[] = ['Complete', 'Rendering', 'Queued'];

const getLoadedAt = (index: number) => {
  const totalMinutes = 9 * 60 + 12 + index * 4;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;

  return `2026-04-18 ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const infiniteRenderRows: InfiniteRenderRow[] = Array.from(
  { length: 60 },
  (_, index) => ({
    id: `IR-${String(index + 1).padStart(3, '0')}`,
    screen: screenScenarios[index % screenScenarios.length],
    module: modules[index % modules.length],
    status: statuses[index % statuses.length],
    requestCount: 4 + ((index * 7) % 19),
    loadedAt: getLoadedAt(index),
  }),
);
