import type { EChartsOption } from 'echarts';
import type { ChartCapabilityNode } from '../../../../types/dashboard';
import { buildNoDataGraphic } from '../shared';

const sortCapabilityNodes = (
  nodes: ChartCapabilityNode[],
): ChartCapabilityNode[] =>
  [...nodes]
    .map((node) => ({
      ...node,
      children: node.children ? sortCapabilityNodes(node.children) : undefined,
    }))
    .sort((first, second) => second.value - first.value);

const generateOption = (
  nodes: ChartCapabilityNode[],
  emptyLabel = 'No chart data to display.',
): EChartsOption => {
  const isEmpty = nodes.length === 0;

  return {
    aria: { enabled: true },
    graphic: isEmpty ? buildNoDataGraphic(emptyLabel) : undefined,
    tooltip: {
      show: !isEmpty,
      trigger: 'item',
    },
    series: [
      {
        type: 'treemap',
        roam: false,
        silent: isEmpty,
        nodeClick: isEmpty ? false : 'zoomToNode',
        breadcrumb: {
          show: !isEmpty,
          height: 22,
          bottom: 0,
          itemStyle: {
            color: '#e0f2fe',
            borderColor: '#93c5fd',
            textStyle: {
              color: '#075985',
              fontWeight: 800,
            },
          },
          emphasis: {
            itemStyle: {
              color: '#bfdbfe',
              borderColor: '#2563eb',
              textStyle: {
                color: '#0f172a',
                fontWeight: 900,
              },
            },
          },
        },
        leafDepth: 1,
        top: 8,
        left: 8,
        right: 8,
        bottom: 34,
        label: {
          show: !isEmpty,
          color: '#ffffff',
          fontWeight: 800,
        },
        upperLabel: {
          show: !isEmpty,
          height: 24,
          color: '#27323a',
          fontWeight: 800,
        },
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 4,
          borderRadius: 6,
          gapWidth: 6,
        },
        levels: [
          {
            color: ['#0f766e', '#2563eb', '#b45309'],
            itemStyle: {
              borderColor: '#ffffff',
              borderWidth: 5,
              gapWidth: 7,
            },
          },
          {
            colorSaturation: [0.45, 0.75],
            itemStyle: {
              borderColor: '#ffffff',
              borderWidth: 4,
              gapWidth: 5,
            },
          },
          {
            itemStyle: {
              borderColor: '#ffffff',
              borderWidth: 3,
              gapWidth: 4,
            },
          },
        ],
        data: isEmpty ? [] : sortCapabilityNodes(nodes),
      },
    ],
  };
};

export default generateOption;
