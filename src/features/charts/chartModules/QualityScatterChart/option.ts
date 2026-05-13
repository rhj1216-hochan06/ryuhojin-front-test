import type { EChartsOption } from 'echarts';
import type { ChartOptionLabels } from '../../../../i18n/dictionary';
import type { QualityScatterPoint } from '../../../../types/dashboard';
import { axisTextColor, buildNoDataGraphic, splitLineColor } from '../shared';

const generateOption = (
  points: QualityScatterPoint[],
  labels: ChartOptionLabels['qualityScatter'],
): EChartsOption => ({
  aria: { enabled: true },
  graphic: points.length === 0 ? buildNoDataGraphic(labels.emptyLabel) : undefined,
  color: ['#be123c'],
  tooltip: { trigger: 'item' },
  grid: {
    left: 46,
    right: 92,
    top: 32,
    bottom: 36,
  },
  xAxis: {
    name: labels.cycleTimeAxis,
    type: 'value',
    axisLabel: { color: axisTextColor },
    splitLine: { lineStyle: { color: splitLineColor } },
  },
  yAxis: {
    name: labels.defectRateAxis,
    type: 'value',
    axisLabel: { color: axisTextColor },
    splitLine: { lineStyle: { color: splitLineColor } },
  },
  visualMap: {
    min: 3,
    max: 8,
    dimension: 2,
    orient: 'vertical',
    right: 0,
    top: 'middle',
    itemHeight: 120,
    itemWidth: 12,
    text: [labels.complexityHigh, labels.complexityLow],
    inRange: {
      color: ['#0f766e', '#b45309', '#be123c'],
    },
  },
  series: [
    {
      name: labels.seriesName,
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

export default generateOption;
