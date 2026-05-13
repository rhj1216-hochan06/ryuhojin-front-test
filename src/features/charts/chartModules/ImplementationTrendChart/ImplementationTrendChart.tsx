import { useMemo } from 'react';
import type { ChartCardCopy, ChartOptionLabels } from '../../../../i18n/dictionary';
import type { ChartImplementationTrendMetric } from '../../../../types/dashboard';
import { EChart } from '../../EChart';
import { ChartModuleFrame } from '../ChartModuleFrame';
import generateOption from './option';

interface ImplementationTrendChartProps {
  metrics: ChartImplementationTrendMetric[];
  labels: ChartOptionLabels['implementationTrend'];
  copy: ChartCardCopy;
  isEmpty: boolean;
}

export const ImplementationTrendChart = ({
  metrics,
  labels,
  copy,
  isEmpty,
}: ImplementationTrendChartProps) => {
  const option = useMemo(() => generateOption(metrics, labels), [labels, metrics]);

  return (
    <ChartModuleFrame isEmpty={isEmpty} emptyMessage={labels.emptyLabel}>
      <EChart
        option={option}
        ariaLabel={copy.ariaLabel}
        fallbackDescription={copy.fallbackDescription}
      />
    </ChartModuleFrame>
  );
};
