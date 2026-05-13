import type { EChartsOption } from 'echarts';
import type { ChartOptionLabels } from '../../../../i18n/dictionary';
import type {
  GenderBoxPlotGender,
  GenderBoxPlotMetric,
} from '../../../../types/dashboard';
import {
  axisTextColor,
  buildNoDataGraphic,
  isRecord,
  splitLineColor,
  type ChartLegendSelection,
} from '../shared';

const genderBoxPlotOrder: GenderBoxPlotGender[] = ['Male', 'Female'];
const genderBoxPlotColors: Record<GenderBoxPlotGender, string> = {
  Male: '#2563eb',
  Female: '#e4499a',
};
const genderBoxPlotFillColors: Record<GenderBoxPlotGender, string> = {
  Male: 'rgba(37, 99, 235, 0.22)',
  Female: 'rgba(228, 73, 154, 0.22)',
};

interface ComputedGenderBoxPlotMetric extends GenderBoxPlotMetric {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}

const isLegendItemVisible = (
  legendSelection: ChartLegendSelection | undefined,
  name: string,
) => legendSelection?.[name] !== false;

const getTooltipDataMetricIndex = (params: unknown) => {
  if (!isRecord(params) || !isRecord(params.data)) {
    return null;
  }

  return typeof params.data.metricIndex === 'number' ? params.data.metricIndex : null;
};

const getChartDataFocusKey = (params: unknown) => {
  if (!isRecord(params) || !isRecord(params.data)) {
    return null;
  }

  return typeof params.data.focusKey === 'string' ? params.data.focusKey : null;
};

export const getGenderBoxPlotFocusKey = getChartDataFocusKey;

const getQuantile = (sortedValues: number[], percentile: number) => {
  if (sortedValues.length === 0) {
    return 0;
  }

  const index = (sortedValues.length - 1) * percentile;
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  const weight = index - lowerIndex;

  return (
    sortedValues[lowerIndex] * (1 - weight) + sortedValues[upperIndex] * weight
  );
};

const computeGenderBoxPlotMetric = (
  metric: GenderBoxPlotMetric,
): ComputedGenderBoxPlotMetric => {
  const sortedValues = [...metric.values].sort((first, second) => first - second);
  const q1 = getQuantile(sortedValues, 0.25);
  const median = getQuantile(sortedValues, 0.5);
  const q3 = getQuantile(sortedValues, 0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - iqr * 1.5;
  const upperFence = q3 + iqr * 1.5;
  const inliers = sortedValues.filter(
    (value) => value >= lowerFence && value <= upperFence,
  );
  const outliers = sortedValues.filter(
    (value) => value < lowerFence || value > upperFence,
  );

  return {
    ...metric,
    min: inliers[0] ?? sortedValues[0] ?? 0,
    q1,
    median,
    q3,
    max: inliers[inliers.length - 1] ?? sortedValues[sortedValues.length - 1] ?? 0,
    outliers,
  };
};

const formatGenderBoxPlotTooltip = (
  metric: ComputedGenderBoxPlotMetric,
  labels: ChartOptionLabels['genderBoxPlot'],
  formatter: Intl.NumberFormat,
) => {
  const label = `${metric.group} - ${labels.genderLabels[metric.gender]}`;
  const markerColor = genderBoxPlotColors[metric.gender];
  const outlierLabel =
    metric.outliers.length > 0
      ? metric.outliers
          .map((outlier) => formatter.format(outlier))
          .reduce<string[]>((lines, outlier, index) => {
            const lineIndex = Math.floor(index / 5);
            const linePrefix = lineIndex > 0 && !lines[lineIndex] ? ', ' : '';
            lines[lineIndex] = lines[lineIndex]
              ? `${lines[lineIndex]}, ${outlier}`
              : `${linePrefix}${outlier}`;

            return lines;
          }, [])
          .join('<br />')
      : '-';
  const rows = [
    [labels.statsLabels.max, formatter.format(metric.max)],
    [labels.statsLabels.q3, formatter.format(metric.q3)],
    [labels.statsLabels.median, formatter.format(metric.median)],
    [labels.statsLabels.q1, formatter.format(metric.q1)],
    [labels.statsLabels.min, formatter.format(metric.min)],
    [labels.statsLabels.outlier, outlierLabel],
  ];

  return `
    <div style="min-width:168px;padding:10px 12px;border:1px solid #e4eaf0;border-radius:6px;background:#ffffff;color:#27323a;box-shadow:0 8px 22px rgba(15,23,42,0.12);font-size:12px;line-height:1.55;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;font-weight:800;">
        <span style="width:7px;height:7px;border-radius:50%;background:${markerColor};display:inline-block;"></span>
        <span>${label}</span>
      </div>
      ${rows
        .map(
          ([name, value]) =>
            `<div style="display:grid;grid-template-columns:auto minmax(62px,1fr);gap:16px;font-weight:700;"><span>${name}</span><span style="text-align:right;">${value}</span></div>`,
        )
        .join('')}
    </div>
  `;
};

const generateOption = (
  metrics: GenderBoxPlotMetric[],
  labels: ChartOptionLabels['genderBoxPlot'],
  legendSelection?: ChartLegendSelection,
  focusedKey?: string | null,
): EChartsOption => {
  const formatter = new Intl.NumberFormat(labels.numberLocale);
  const computedMetrics = metrics.map(computeGenderBoxPlotMetric);
  const groups = Array.from(new Set(computedMetrics.map((metric) => metric.group)));
  const getMetric = (group: string, gender: GenderBoxPlotGender) =>
    computedMetrics.find((metric) => metric.group === group && metric.gender === gender);
  const isGenderVisible = (gender: GenderBoxPlotGender) =>
    isLegendItemVisible(legendSelection, labels.genderLabels[gender]);
  const axisSlots = groups.flatMap((group) =>
    genderBoxPlotOrder.flatMap((gender) => {
      const metric = getMetric(group, gender);

      return metric
        ? [
            {
              group,
              gender,
              metric,
            },
          ]
        : [];
    }),
  );
  const visibleAxisSlots = axisSlots
    .filter((slot) => isGenderVisible(slot.gender))
    .map((slot, slotIndex) => ({
      ...slot,
      slotIndex,
    }));
  const visibleGroups = groups.filter((group) =>
    visibleAxisSlots.some((slot) => slot.group === group),
  );
  const metricSlotIndex = new Map(
    visibleAxisSlots.map((slot) => [slot.metric, slot.slotIndex]),
  );

  const boxplotData = visibleAxisSlots.map(({ gender, metric, slotIndex }) => ({
    value: [metric.min, metric.q1, metric.median, metric.q3, metric.max],
    metricIndex: computedMetrics.indexOf(metric),
    gender,
    slotIndex,
    focusKey: `${gender}-${slotIndex}`,
    itemStyle: {
      color: genderBoxPlotFillColors[gender],
      borderColor: genderBoxPlotColors[gender],
      borderWidth: 1.5,
      opacity:
        focusedKey && focusedKey !== `${gender}-${slotIndex}` ? 0.35 : 1,
    },
  }));

  const getOutlierData = (gender: GenderBoxPlotGender) =>
    computedMetrics
      .filter((metric) => metric.gender === gender)
      .flatMap((metric) => {
        const slotIndex = metricSlotIndex.get(metric);

        if (slotIndex === undefined) {
          return [];
        }

        return metric.outliers.map((outlier) => ({
          value: [slotIndex, outlier],
          gender,
          slotIndex,
          metricIndex: computedMetrics.indexOf(metric),
          focusKey: `${gender}-${slotIndex}`,
          itemStyle: {
            color: genderBoxPlotColors[gender],
            opacity:
              focusedKey && focusedKey !== `${gender}-${slotIndex}` ? 0.35 : 1,
          },
        }));
      });

  const outlierSeries = genderBoxPlotOrder.map((gender) => ({
    name: labels.genderLabels[gender],
    type: 'scatter' as const,
    symbolSize: 7,
    data: isGenderVisible(gender) ? getOutlierData(gender) : [],
    z: 3,
  }));

  const legendData = genderBoxPlotOrder.map((gender) => ({
    name: labels.genderLabels[gender],
    itemStyle: {
      color: genderBoxPlotColors[gender],
    },
  }));
  const primaryXAxis = {
    type: 'category' as const,
    data: visibleAxisSlots.map((slot) => labels.genderLabels[slot.gender]),
    boundaryGap: true,
    axisPointer: { type: 'shadow' as const },
    axisTick: { show: false },
    axisLabel: {
      show: false,
    },
    axisLine: { lineStyle: { color: splitLineColor } },
  };
  const groupedXAxis = {
    type: 'category' as const,
    data: visibleGroups,
    boundaryGap: true,
    position: 'bottom' as const,
    axisPointer: { show: false },
    axisTick: { show: false },
    axisLine: { show: false },
    splitLine: { show: false },
    axisLabel: {
      color: axisTextColor,
      interval: 0,
      lineHeight: 16,
    },
  };

  return {
    aria: { enabled: true },
    graphic: metrics.length === 0 ? buildNoDataGraphic(labels.emptyLabel) : undefined,
    color: genderBoxPlotOrder.map((gender) => genderBoxPlotColors[gender]),
    tooltip: {
      trigger: 'item',
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
      extraCssText: 'box-shadow:none;',
      formatter: (params: unknown) => {
        const metricIndex = getTooltipDataMetricIndex(params);
        const metric =
          typeof metricIndex === 'number' ? computedMetrics[metricIndex] : undefined;

        if (!metric) {
          return '';
        }

        return formatGenderBoxPlotTooltip(metric, labels, formatter);
      },
    },
    legend: {
      top: 0,
      right: 0,
      data: legendData,
      selected: legendSelection,
      icon: 'circle',
      itemWidth: 7,
      itemHeight: 7,
      itemGap: 10,
      textStyle: { color: axisTextColor },
    },
    grid: {
      left: 46,
      right: 28,
      top: 54,
      bottom: 44,
    },
    xAxis: [primaryXAxis, groupedXAxis],
    yAxis: {
      type: 'value',
      name: labels.valueAxis,
      axisLabel: { color: axisTextColor },
      nameTextStyle: {
        padding: [0, 0, 0, -30],
      },
      splitLine: { lineStyle: { color: splitLineColor } },
    },
    series: [
      {
        name: labels.seriesName,
        type: 'boxplot',
        boxWidth: [6, 18],
        data: boxplotData,
        emphasis: { disabled: true },
        z: 2,
      },
      ...outlierSeries,
    ],
  };
};

export default generateOption;
