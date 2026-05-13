import type { EChartsOption } from 'echarts';
import type { ChartOptionLabels } from '../../../../i18n/dictionary';
import type { ChartImplementationTrendMetric } from '../../../../types/dashboard';
import {
  axisTextColor,
  buildNoDataGraphic,
  roundedBarTopRadius,
  splitLineColor,
} from '../shared';

const generateOption = (
  metrics: ChartImplementationTrendMetric[],
  labels: ChartOptionLabels['implementationTrend'],
): EChartsOption => {
  const isEmpty = metrics.length === 0;

  return {
    aria: { enabled: true },
    graphic: isEmpty ? buildNoDataGraphic(labels.emptyLabel) : undefined,
    color: ['rgba(37, 99, 235, 0.18)', '#0f766e', '#be123c'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      top: 0,
      textStyle: { color: axisTextColor },
    },
    grid: {
      left: 44,
      right: 52,
      top: 52,
      bottom: isEmpty ? 34 : 58,
    },
    dataZoom: isEmpty
      ? undefined
      : [
          {
            type: 'inside',
            xAxisIndex: 0,
            start: 0,
            end: 50,
            zoomOnMouseWheel: false,
            moveOnMouseWheel: true,
            moveOnMouseMove: false,
            preventDefaultMouseMove: true,
          },
          {
            type: 'slider',
            xAxisIndex: 0,
            start: 0,
            end: 50,
            height: 18,
            bottom: 8,
            zoomLock: true,
            brushSelect: false,
          },
        ],
    xAxis: {
      type: 'category',
      data: metrics.map((metric) => metric.month),
      axisLabel: { color: axisTextColor },
      axisLine: { lineStyle: { color: splitLineColor } },
    },
    yAxis: [
      {
        type: 'value',
        name: labels.casesAxis,
        axisLabel: { color: axisTextColor },
        splitLine: { lineStyle: { color: splitLineColor } },
      },
      {
        type: 'value',
        name: labels.reviewAxis,
        min: 60,
        max: 100,
        axisLabel: { color: axisTextColor },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: labels.previous,
        type: 'bar',
        barWidth: 16,
        itemStyle: {
          borderColor: '#2563eb',
          borderType: 'dashed',
          borderWidth: 1,
          borderRadius: roundedBarTopRadius,
        },
        data: metrics.map((metric) => metric.previous),
      },
      {
        name: labels.current,
        type: 'bar',
        barWidth: 16,
        itemStyle: {
          borderRadius: roundedBarTopRadius,
        },
        data: metrics.map((metric) => metric.current),
      },
      {
        name: labels.reviewScore,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        data: metrics.map((metric) => metric.reviewScore),
      },
    ],
  };
};

export default generateOption;
