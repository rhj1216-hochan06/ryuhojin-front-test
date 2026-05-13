import { useMemo, useState } from 'react';
import type { ChartCardCopy, ChartOptionLabels } from '../../../../i18n/dictionary';
import type { ChartBusinessTrendMetric } from '../../../../types/dashboard';
import { EChart } from '../../EChart';
import { ChartModuleFrame } from '../ChartModuleFrame';
import type { ChartLegendSelection } from '../shared';
import generateOption from './option';

interface BusinessTrendChartProps {
  metrics: ChartBusinessTrendMetric[];
  labels: ChartOptionLabels['businessTrend'];
  copy: ChartCardCopy;
  isEmpty: boolean;
}

export const BusinessTrendChart = ({
  metrics,
  labels,
  copy,
  isEmpty,
}: BusinessTrendChartProps) => {
  const [legendSelection, setLegendSelection] = useState<ChartLegendSelection>({});
  const option = useMemo(
    () => generateOption(metrics, labels, legendSelection),
    [labels, legendSelection, metrics],
  );

  return (
    <ChartModuleFrame isEmpty={isEmpty} emptyMessage={labels.emptyLabel}>
      <EChart
        option={option}
        ariaLabel={copy.ariaLabel}
        fallbackDescription={copy.fallbackDescription}
        onLegendSelectChanged={setLegendSelection}
      />
    </ChartModuleFrame>
  );
};
