import { useMemo, useState } from 'react';
import type { ChartCardCopy, ChartOptionLabels } from '../../../../i18n/dictionary';
import type { ChartCategoryShare } from '../../../../types/dashboard';
import { EChart, type ChartSize } from '../../EChart';
import { ChartModuleFrame } from '../ChartModuleFrame';
import generateOption from './option';

interface CategoryShareChartProps {
  shares: ChartCategoryShare[];
  labels: ChartOptionLabels['categoryShare'];
  copy: ChartCardCopy;
  isEmpty: boolean;
}

export const CategoryShareChart = ({
  shares,
  labels,
  copy,
  isEmpty,
}: CategoryShareChartProps) => {
  const [chartSize, setChartSize] = useState<ChartSize>();
  const option = useMemo(
    () => generateOption(shares, labels, chartSize),
    [chartSize, labels, shares],
  );

  return (
    <ChartModuleFrame isEmpty={isEmpty} emptyMessage={labels.emptyLabel}>
      <EChart
        option={option}
        ariaLabel={copy.ariaLabel}
        fallbackDescription={copy.fallbackDescription}
        onSizeChange={setChartSize}
      />
    </ChartModuleFrame>
  );
};
