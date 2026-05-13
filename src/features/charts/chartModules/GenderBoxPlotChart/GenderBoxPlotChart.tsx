import { useMemo, useState } from 'react';
import type { ChartCardCopy, ChartOptionLabels } from '../../../../i18n/dictionary';
import type { GenderBoxPlotMetric } from '../../../../types/dashboard';
import { EChart } from '../../EChart';
import { ChartModuleFrame } from '../ChartModuleFrame';
import type { ChartLegendSelection } from '../shared';
import generateOption, { getGenderBoxPlotFocusKey } from './option';

interface GenderBoxPlotChartProps {
  metrics: GenderBoxPlotMetric[];
  labels: ChartOptionLabels['genderBoxPlot'];
  copy: ChartCardCopy;
  isEmpty: boolean;
}

export const GenderBoxPlotChart = ({
  metrics,
  labels,
  copy,
  isEmpty,
}: GenderBoxPlotChartProps) => {
  const [legendSelection, setLegendSelection] = useState<ChartLegendSelection>({});
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const option = useMemo(
    () => generateOption(metrics, labels, legendSelection, focusKey),
    [focusKey, labels, legendSelection, metrics],
  );

  return (
    <ChartModuleFrame isEmpty={isEmpty} emptyMessage={labels.emptyLabel}>
      <EChart
        option={option}
        ariaLabel={copy.ariaLabel}
        fallbackDescription={copy.fallbackDescription}
        onLegendSelectChanged={setLegendSelection}
        onMouseOver={(params) => setFocusKey(getGenderBoxPlotFocusKey(params))}
        onMouseOut={() => setFocusKey(null)}
      />
    </ChartModuleFrame>
  );
};
