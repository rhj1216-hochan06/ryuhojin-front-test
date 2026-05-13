import { useMemo } from 'react';
import type { ChartCardCopy } from '../../../../i18n/dictionary';
import type { ChartCapabilityNode } from '../../../../types/dashboard';
import { EChart } from '../../EChart';
import { ChartModuleFrame } from '../ChartModuleFrame';
import generateOption from './option';

interface CapabilityTreemapChartProps {
  nodes: ChartCapabilityNode[];
  emptyLabel: string;
  copy: ChartCardCopy;
  isEmpty: boolean;
}

export const CapabilityTreemapChart = ({
  nodes,
  emptyLabel,
  copy,
  isEmpty,
}: CapabilityTreemapChartProps) => {
  const option = useMemo(() => generateOption(nodes, emptyLabel), [emptyLabel, nodes]);

  return (
    <ChartModuleFrame isEmpty={isEmpty} emptyMessage={emptyLabel}>
      <EChart
        option={option}
        ariaLabel={copy.ariaLabel}
        fallbackDescription={copy.fallbackDescription}
      />
    </ChartModuleFrame>
  );
};
