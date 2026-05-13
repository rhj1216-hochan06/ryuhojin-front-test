import type { EChartsOption } from 'echarts';
import type { ChartOptionLabels } from '../../../../i18n/dictionary';
import type { ChartBusinessTrendMetric } from '../../../../types/dashboard';
import {
  axisTextColor,
  buildNoDataGraphic,
  roundedBarTopRadius,
  splitLineColor,
  squareBarRadius,
  type ChartLegendSelection,
  type StackedBarSeries,
} from '../shared';

const isLegendItemVisible = (
  legendSelection: ChartLegendSelection | undefined,
  name: string,
) => legendSelection?.[name] !== false;

const isVisibleStackTop = (
  stack: StackedBarSeries[],
  seriesIndex: number,
  dataIndex: number,
  legendSelection?: ChartLegendSelection,
) => {
  const currentSeries = stack[seriesIndex];

  if (
    currentSeries.values[dataIndex] === null ||
    currentSeries.values[dataIndex] === 0 ||
    !isLegendItemVisible(legendSelection, currentSeries.name)
  ) {
    return false;
  }

  return stack
    .slice(seriesIndex + 1)
    .every(
      (series) =>
        series.values[dataIndex] === 0 ||
        series.values[dataIndex] === null ||
        !isLegendItemVisible(legendSelection, series.name),
    );
};

const buildStackedBarData = (
  stack: StackedBarSeries[],
  seriesIndex: number,
  legendSelection?: ChartLegendSelection,
) =>
  stack[seriesIndex].values.map((value, dataIndex) => ({
    value,
    itemStyle: {
      borderRadius: isVisibleStackTop(stack, seriesIndex, dataIndex, legendSelection)
        ? roundedBarTopRadius
        : squareBarRadius,
    },
  }));

const generateOption = (
  metrics: ChartBusinessTrendMetric[],
  labels: ChartOptionLabels['businessTrend'],
  legendSelection?: ChartLegendSelection,
): EChartsOption => {
  const businessStack = [
    {
      name: labels.revenueIndex,
      values: metrics.map((metric) => metric.revenue),
    },
    {
      name: labels.activeUsers,
      values: metrics.map((metric) => metric.activeUsers),
    },
  ];

  return {
    aria: { enabled: true },
    graphic: metrics.length === 0 ? buildNoDataGraphic(labels.emptyLabel) : undefined,
    color: ['#2563eb', '#0f766e', '#b45309'],
    tooltip: { trigger: 'axis' },
    legend: {
      top: 0,
      selected: legendSelection,
      textStyle: { color: axisTextColor },
    },
    grid: {
      left: 42,
      right: 48,
      top: 52,
      bottom: 34,
    },
    xAxis: {
      type: 'category',
      data: metrics.map((metric) => metric.month),
      axisLabel: { color: axisTextColor },
      axisLine: { lineStyle: { color: splitLineColor } },
    },
    yAxis: [
      {
        type: 'value',
        name: labels.revenueAxis,
        axisLabel: { color: axisTextColor },
        splitLine: { lineStyle: { color: splitLineColor } },
      },
      {
        type: 'value',
        name: labels.conversionAxis,
        axisLabel: { color: axisTextColor },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: labels.revenueIndex,
        type: 'bar',
        stack: 'monthlyMetrics',
        barWidth: 18,
        itemStyle: {
          color: '#2563eb',
        },
        data: buildStackedBarData(businessStack, 0, legendSelection),
      },
      {
        name: labels.activeUsers,
        type: 'bar',
        stack: 'monthlyMetrics',
        barWidth: 18,
        itemStyle: {
          color: '#0f766e',
        },
        data: buildStackedBarData(businessStack, 1, legendSelection),
      },
      {
        name: labels.conversionRate,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbolSize: 8,
        data: metrics.map((metric) => metric.conversionRate),
      },
    ],
  };
};

export default generateOption;
