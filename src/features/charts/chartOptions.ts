import type { EChartsOption } from 'echarts';
import type { ChartOptionLabels } from '../../i18n/dictionary';
import type {
  ChartCapabilityNode,
  ChartCategoryShare,
  ChartImplementationMetric,
  GenderBoxPlotGender,
  GenderBoxPlotMetric,
  MonthlyBusinessMetric,
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
  values: number[];
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

const isVisibleStackTop = (
  stack: StackedBarSeries[],
  seriesIndex: number,
  dataIndex: number,
  legendSelection?: ChartLegendSelection,
) => {
  const currentSeries = stack[seriesIndex];

  if (
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

const getTooltipValue = (params: unknown) => {
  if (!isRecord(params)) {
    return null;
  }

  return Array.isArray(params.value) ? params.value : null;
};

export const buildBusinessTrendOption = (
  metrics: MonthlyBusinessMetric[],
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
  metrics: ChartImplementationMetric[],
  labels: ChartOptionLabels['implementationTrend'],
): EChartsOption => ({
  aria: { enabled: true },
  color: ['rgba(37, 99, 235, 0.18)', '#0f766e', '#be123c'],
  tooltip: { trigger: 'axis' },
  legend: {
    top: 0,
    textStyle: { color: axisTextColor },
  },
  grid: {
    left: 44,
    right: 52,
    top: 52,
    bottom: 58,
  },
  dataZoom: [
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
});

export const buildQualityScatterOption = (
  points: QualityScatterPoint[],
  labels: ChartOptionLabels['qualityScatter'],
): EChartsOption => ({
  aria: { enabled: true },
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
): EChartsOption => {
  const formatter = new Intl.NumberFormat(labels.numberLocale);
  const groups = Array.from(new Set(metrics.map((metric) => metric.group)));
  const getMetric = (group: string, gender: GenderBoxPlotGender) =>
    metrics.find((metric) => metric.group === group && metric.gender === gender);
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

  const formatMetricTooltip = (metric: GenderBoxPlotMetric) =>
    [
      `<strong>${metric.group} - ${labels.genderLabels[metric.gender]}</strong>`,
      `${labels.statsLabels.min}: ${formatter.format(metric.min)}`,
      `${labels.statsLabels.q1}: ${formatter.format(metric.q1)}`,
      `${labels.statsLabels.median}: ${formatter.format(metric.median)}`,
      `${labels.statsLabels.q3}: ${formatter.format(metric.q3)}`,
      `${labels.statsLabels.max}: ${formatter.format(metric.max)}`,
    ].join('<br/>');

  const boxplotData = visibleAxisSlots.map(({ gender, metric, slotIndex }) => ({
    value: [metric.min, metric.q1, metric.median, metric.q3, metric.max],
    metricIndex: metrics.indexOf(metric),
    gender,
    slotIndex,
    itemStyle: {
      color: genderBoxPlotFillColors[gender],
      borderColor: genderBoxPlotColors[gender],
      borderWidth: 1.5,
    },
  }));

  const getOutlierData = (gender: GenderBoxPlotGender) =>
    metrics
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
          metricIndex: metrics.indexOf(metric),
          itemStyle: {
            color: genderBoxPlotColors[gender],
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
    color: genderBoxPlotOrder.map((gender) => genderBoxPlotColors[gender]),
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const metricIndex = getTooltipDataMetricIndex(params);
        const metric =
          typeof metricIndex === 'number' ? metrics[metricIndex] : undefined;

        if (!metric) {
          return '';
        }

        const value = getTooltipValue(params);

        if (value && value.length === 2) {
          return [
            `<strong>${metric.group} - ${labels.genderLabels[metric.gender]}</strong>`,
            `${labels.statsLabels.outlier}: ${formatter.format(Number(value[1]))}`,
          ].join('<br/>');
        }

        return formatMetricTooltip(metric);
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
): EChartsOption => ({
  aria: { enabled: true },
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'treemap',
      roam: false,
      nodeClick: 'zoomToNode',
      breadcrumb: {
        show: true,
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
        show: true,
        color: '#ffffff',
        fontWeight: 800,
      },
      upperLabel: {
        show: true,
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
      data: sortCapabilityNodes(nodes),
    },
  ],
});

export const buildCategoryShareOption = (
  shares: ChartCategoryShare[],
  labels: ChartOptionLabels['categoryShare'],
): EChartsOption => {
  const activeSliceCount = shares.filter((share) => Number(share.value) > 0).length;
  const numberFormatter = new Intl.NumberFormat(labels.numberLocale);
  const shareValueByName = new Map(
    shares.map((share) => [share.name, numberFormatter.format(share.value)]),
  );

  return {
    aria: { enabled: true },
    color: ['#4f8df7', '#e4499a', '#0f766e', '#b45309'],
    tooltip: {
      trigger: 'item',
      formatter: formatPieTooltip,
    },
    legend: {
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
    graphic: {
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
    series: [
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
): EChartsOption => ({
  aria: { enabled: true },
  tooltip: { trigger: 'item' },
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
      nodeGap: 8,
      nodeWidth: 0,
      emphasis: {
        focus: 'none',
        lineStyle: {
          opacity: 0.95,
        },
      },
      label: { show: false },
      data: workflow.nodes.map((node) => ({
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
