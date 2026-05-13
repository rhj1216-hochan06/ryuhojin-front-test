import type { EChartsOption, LabelLayoutOptionCallbackParams } from 'echarts';
import type { ChartOptionLabels } from '../../i18n/dictionary';
import type {
  ChartBusinessTrendMetric,
  ChartCapabilityNode,
  ChartCategoryShare,
  ChartImplementationTrendMetric,
  ChartMetricValue,
  GenderBoxPlotGender,
  GenderBoxPlotMetric,
  QualityScatterPoint,
  WorkflowSankeyData,
} from '../../types/dashboard';

const axisTextColor = '#64717f';
const splitLineColor = '#e4eaf0';
const roundedBarTopRadius = [20, 20, 0, 0];
const squareBarRadius = [0, 0, 0, 0];
export const workflowSourceOrder = ['A', 'C', 'D2'] as const;
export const workflowTargetOrder = ['A-1', 'C-1', 'D2-1'] as const;
const genderBoxPlotOrder: GenderBoxPlotGender[] = ['Male', 'Female'];
const genderBoxPlotColors: Record<GenderBoxPlotGender, string> = {
  Male: '#2563eb',
  Female: '#e4499a',
};
const genderBoxPlotFillColors: Record<GenderBoxPlotGender, string> = {
  Male: 'rgba(37, 99, 235, 0.22)',
  Female: 'rgba(228, 73, 154, 0.22)',
};

export type ChartLegendSelection = Record<string, boolean>;

interface StackedBarSeries {
  name: string;
  values: ChartMetricValue[];
}

interface ChartSize {
  width: number;
  height: number;
}

interface ComputedGenderBoxPlotMetric extends GenderBoxPlotMetric {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}

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

const isLegendItemVisible = (
  legendSelection: ChartLegendSelection | undefined,
  name: string,
) => legendSelection?.[name] !== false;

const buildNoDataGraphic = (text: string): EChartsOption['graphic'] => ({
  type: 'text',
  left: 'center',
  top: 'middle',
  z: 20,
  silent: true,
  style: {
    text,
    align: 'center',
    fill: axisTextColor,
    fontSize: 13,
    fontWeight: 800,
  },
});

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

const formatPieTooltip = (params: unknown) => {
  if (
    typeof params === 'object' &&
    params !== null &&
    'name' in params &&
    'value' in params
  ) {
    const { name, value } = params;

    return `${String(name)}: ${String(value)}`;
  }

  return '';
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

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

const createCenteredPieLabelLayout =
  (chartSize?: ChartSize) =>
  ({ labelRect, rect }: LabelLayoutOptionCallbackParams) => {
    const centerX = chartSize ? chartSize.width / 2 : rect.x + rect.width / 2;
    const centerY = chartSize ? chartSize.height / 2 : rect.y + rect.height / 2;
    const labelX = labelRect.x + labelRect.width / 2;
    const labelY = labelRect.y + labelRect.height / 2;
    const centerPullRatio = 0.95;

    return {
      x: centerX + (labelX - centerX) * centerPullRatio,
      y: centerY + (labelY - centerY) * centerPullRatio,
    };
  };

export const buildBusinessTrendOption = (
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

export const buildImplementationTrendOption = (
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

export const buildQualityScatterOption = (
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

export const buildGenderBoxPlotOption = (
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

const sortCapabilityNodes = (
  nodes: ChartCapabilityNode[],
): ChartCapabilityNode[] =>
  [...nodes]
    .map((node) => ({
      ...node,
      children: node.children ? sortCapabilityNodes(node.children) : undefined,
    }))
    .sort((first, second) => second.value - first.value);

export const buildCapabilityTreemapOption = (
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

export const buildCategoryShareOption = (
  shares: ChartCategoryShare[],
  labels: ChartOptionLabels['categoryShare'],
  chartSize?: ChartSize,
): EChartsOption => {
  const isEmpty = shares.length === 0;
  const activeSliceCount = shares.filter((share) => Number(share.value) > 0).length;
  const numberFormatter = new Intl.NumberFormat(labels.numberLocale);
  const shareValueByName = new Map(
    shares.map((share) => [share.name, numberFormatter.format(share.value)]),
  );

  return {
    aria: { enabled: true },
    color: ['#4f8df7', '#e4499a', '#0f766e', '#b45309'],
    tooltip: {
      show: !isEmpty,
      trigger: 'item',
      formatter: formatPieTooltip,
    },
    legend: {
      show: !isEmpty,
      top: 0,
      left: 'center',
      icon: 'circle',
      itemWidth: 7,
      itemHeight: 7,
      itemGap: 16,
      backgroundColor: '#f4f6fb',
      borderRadius: 8,
      padding: [10, 14],
      formatter: (name: string) =>
        `{name|${name}}  {value|${shareValueByName.get(name) ?? ''}}`,
      textStyle: {
        color: '#27323a',
        fontSize: 12,
        rich: {
          name: {
            color: '#27323a',
            fontSize: 12,
            fontWeight: 500,
          },
          value: {
            color: '#111827',
            fontSize: 15,
            fontWeight: 900,
          },
        },
      },
    },
    graphic: isEmpty
      ? buildNoDataGraphic(labels.emptyLabel)
      : {
          type: 'text',
          left: 'center',
          top: '55%',
          z: 10,
          silent: true,
          style: {
            text: labels.centerLabel,
            align: 'center',
            fill: '#27323a',
            fontSize: 20,
            fontWeight: 600,
          },
        },
    series: isEmpty
      ? []
      : [
          {
            name: labels.seriesName,
            type: 'pie',
            radius: ['38%', '72%'],
            center: ['50%', '58%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 1,
              borderColor: '#ffffff',
              borderWidth: activeSliceCount === 1 ? 0 : 2,
            },
            label: {
              show: true,
              position: 'inside',
              formatter: ({ percent }: { percent?: number }) =>
                Number(percent) >= 3 ? `${Math.round(Number(percent))}%` : '',
              color: '#ffffff',
              align: 'center',
              fontSize: 14,
              fontWeight: 400,
            },
            labelLayout: createCenteredPieLabelLayout(chartSize),
            labelLine: {
              show: false,
            },
            emphasis: {
              scale: false,
              focus: 'self',
              itemStyle: {
                opacity: 1,
              },
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
            blur: {
              itemStyle: {
                opacity: 0.4,
              },
            },
            data: shares,
          },
        ],
  };
};

export const buildWorkflowSankeyOption = (
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
