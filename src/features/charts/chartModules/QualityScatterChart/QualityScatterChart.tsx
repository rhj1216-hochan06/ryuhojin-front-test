import { useMemo } from 'react';
import type { ChartCardCopy, ChartOptionLabels } from '../../../../i18n/dictionary';
import type { QualityScatterPoint } from '../../../../types/dashboard';
import { EChart } from '../../EChart';
import { ChartModuleFrame } from '../ChartModuleFrame';
import generateOption from './option';

interface QualityScatterChartProps {
  points: QualityScatterPoint[];
  labels: ChartOptionLabels['qualityScatter'];
  copy: ChartCardCopy;
  isEmpty: boolean;
}

export const QualityScatterChart = ({
  points,
  labels,
  copy,
  isEmpty,
}: QualityScatterChartProps) => {
  const option = useMemo(() => generateOption(points, labels), [labels, points]);

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
