import type { EChartsOption } from 'echarts';
import type { WorkflowSankeyData } from '../../../../types/dashboard';
import { isRecord } from '../shared';

export const workflowSourceOrder = ['A', 'C', 'D2'] as const;
export const workflowTargetOrder = ['A-1', 'C-1', 'D2-1'] as const;

export const judgmentFlowColors = {
  veryImproved: '#4f8df7',
  improved: '#8db8ff',
  noChange: '#b9c6d8',
  worsened: '#f3a49b',
  veryWorsened: '#e36f68',
};

export const getWorkflowLinkColor = (source: string, target: string) => {
  if (source === 'A' && target === 'A-1') return judgmentFlowColors.noChange;
  if (source === 'A' && target === 'C-1') return judgmentFlowColors.worsened;
  if (source === 'A' && target === 'D2-1') return judgmentFlowColors.veryWorsened;
  if (source === 'C' && target === 'A-1') return judgmentFlowColors.improved;
  if (source === 'C' && target === 'C-1') return judgmentFlowColors.noChange;
  if (source === 'C' && target === 'D2-1') return judgmentFlowColors.worsened;
  if (source === 'D2' && target === 'A-1') return judgmentFlowColors.veryImproved;
  if (source === 'D2' && target === 'C-1') return judgmentFlowColors.improved;
  if (source === 'D2' && target === 'D2-1') return judgmentFlowColors.noChange;

  return judgmentFlowColors.noChange;
};

const generateOption = (
  workflow: WorkflowSankeyData,
  nodeLabels?: Record<string, string>,
  unitLabel = '명',
): EChartsOption => ({
  aria: { enabled: true },
  tooltip: {
    trigger: 'item',
    renderMode: 'html',
    formatter: (params: unknown) => {
      if (!isRecord(params)) {
        return '';
      }

      const data = isRecord(params.data) ? params.data : null;
      const source = typeof data?.source === 'string' ? data.source : null;
      const target = typeof data?.target === 'string' ? data.target : null;
      const value = typeof data?.value === 'number' ? data.value : null;

      if (source && target && value !== null) {
        const sourceLabel = nodeLabels?.[source] ?? source;
        const targetLabel = nodeLabels?.[target] ?? target;
        const formattedValue = new Intl.NumberFormat().format(value);
        const linkColor = getWorkflowLinkColor(source, target);
        const colorMarker = `<span style="display:inline-block;margin-right:6px;border-radius:50%;width:8px;height:8px;background:${linkColor};"></span>`;

        return `${colorMarker}${sourceLabel} -> ${targetLabel}: ${formattedValue}${unitLabel}`;
      }

      return '';
    },
  },
  series: [
    {
      type: 'sankey',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '100%',
      nodeAlign: 'left',
      layoutIterations: 0,
      draggable: false,
      nodeGap: 7.5,
      nodeWidth: 0,
      emphasis: {
        focus: 'none',
        lineStyle: {
          opacity: 0.95,
        },
      },
      label: { show: false },
      data: workflow.nodes
        .filter((node) =>
          workflow.links.some(
            (link) =>
              link.value > 0 && (link.source === node.name || link.target === node.name),
          ),
        )
        .map((node) => ({
          ...node,
          label: { show: false },
          itemStyle: { opacity: 0 },
        })),
      links: [...workflow.links]
        .filter((link) => link.value > 0)
        .sort((first, second) => {
          const targetDiff =
            workflowTargetOrder.indexOf(first.target as typeof workflowTargetOrder[number]) -
            workflowTargetOrder.indexOf(second.target as typeof workflowTargetOrder[number]);

          if (targetDiff !== 0) {
            return targetDiff;
          }

          return (
            workflowSourceOrder.indexOf(first.source as typeof workflowSourceOrder[number]) -
            workflowSourceOrder.indexOf(second.source as typeof workflowSourceOrder[number])
          );
        })
        .map((link) => ({
          ...link,
          lineStyle: {
            color: getWorkflowLinkColor(link.source, link.target),
            opacity: 0.58,
            curveness: 0.48,
          },
        })),
    },
  ],
});

export default generateOption;
