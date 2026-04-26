import type { EChartsOption } from 'echarts';
import type {
  MonthlyBusinessMetric,
  QualityScatterPoint,
  WorkflowSankeyData,
} from '../../types/dashboard';

const axisTextColor = '#64717f';
const splitLineColor = '#e4eaf0';

export const buildBusinessTrendOption = (
  metrics: MonthlyBusinessMetric[],
): EChartsOption => ({
  color: ['#2563eb', '#0f766e', '#b45309'],
  tooltip: { trigger: 'axis' },
  legend: {
    top: 0,
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
      name: 'Revenue',
      axisLabel: { color: axisTextColor },
      splitLine: { lineStyle: { color: splitLineColor } },
    },
    {
      type: 'value',
      name: 'Conversion',
      axisLabel: { color: axisTextColor },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: 'Revenue index',
      type: 'bar',
      barWidth: 18,
      data: metrics.map((metric) => metric.revenue),
    },
    {
      name: 'Active users',
      type: 'bar',
      barWidth: 18,
      data: metrics.map((metric) => metric.activeUsers),
    },
    {
      name: 'Conversion rate',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 8,
      data: metrics.map((metric) => metric.conversionRate),
    },
  ],
});

export const buildQualityScatterOption = (
  points: QualityScatterPoint[],
): EChartsOption => ({
  color: ['#be123c'],
  tooltip: { trigger: 'item' },
  grid: {
    left: 46,
    right: 26,
    top: 32,
    bottom: 42,
  },
  xAxis: {
    name: 'Cycle time',
    type: 'value',
    axisLabel: { color: axisTextColor },
    splitLine: { lineStyle: { color: splitLineColor } },
  },
  yAxis: {
    name: 'Defect rate',
    type: 'value',
    axisLabel: { color: axisTextColor },
    splitLine: { lineStyle: { color: splitLineColor } },
  },
  visualMap: {
    min: 3,
    max: 8,
    dimension: 2,
    orient: 'horizontal',
    left: 'center',
    bottom: 0,
    text: ['High complexity', 'Low'],
    inRange: {
      color: ['#0f766e', '#b45309', '#be123c'],
    },
  },
  series: [
    {
      name: 'Feature quality',
      type: 'scatter',
      symbolSize: 16,
      data: points.map((point) => [
        point.cycleTimeDays,
        point.defectRate,
        point.complexity,
        point.feature,
      ]),
    },
  ],
});

export const buildWorkflowSankeyOption = (
  workflow: WorkflowSankeyData,
): EChartsOption => ({
  color: ['#2563eb', '#0f766e', '#b45309', '#be123c', '#475569', '#15803d'],
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'sankey',
      top: 24,
      bottom: 24,
      left: 12,
      right: 20,
      nodeGap: 18,
      nodeWidth: 12,
      emphasis: { focus: 'adjacency' },
      lineStyle: {
        color: 'gradient',
        curveness: 0.45,
        opacity: 0.28,
      },
      label: {
        color: '#27323a',
        fontWeight: 700,
      },
      data: workflow.nodes,
      links: workflow.links,
    },
  ],
});

