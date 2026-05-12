import { useMemo } from 'react';
import type {
  ChartBusinessTrendMetric,
  ChartCardScenarioMap,
  ChartImplementationTrendMetric,
  DashboardPayload,
  GenderBoxPlotMetric,
  GlobalChartScenarioId,
  WorkflowSankeyData,
} from '../../types/dashboard';

interface ChartShowcaseData {
  businessTrend: ChartBusinessTrendMetric[];
  implementationTrend: ChartImplementationTrendMetric[];
  capabilityTree: DashboardPayload['chartCapabilityTree'];
  categoryShare: DashboardPayload['chartCategoryShare'];
  qualityDistribution: DashboardPayload['qualityPoints'];
  genderBoxPlot: DashboardPayload['genderBoxPlotMetrics'];
  workflow: WorkflowSankeyData;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const withRandomOffset = (value: number, maxOffset: number) =>
  value + (Math.random() * 2 - 1) * maxOffset;

const getRandomIndex = (length: number) =>
  length > 0 ? Math.floor(Math.random() * length) : -1;

const getRandomNumber = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

const shuffleItems = <TItem,>(items: readonly TItem[]) =>
  [...items].sort(() => Math.random() - 0.5);

const getRandomItems = <TItem,>(items: readonly TItem[], count: number) =>
  shuffleItems(items).slice(0, count);

const buildRandomizedChartData = (payload: DashboardPayload): ChartShowcaseData => ({
  businessTrend: payload.monthlyMetrics.map((metric) => ({
    ...metric,
    revenue: Math.round(clamp(withRandomOffset(metric.revenue, 8), 20, 240)),
    activeUsers: Math.round(clamp(withRandomOffset(metric.activeUsers, 5), 5, 150)),
    conversionRate: Number(
      clamp(withRandomOffset(metric.conversionRate, 0.5), 1.2, 20).toFixed(1),
    ),
  })),
  implementationTrend: payload.chartImplementationMetrics.map((metric) => ({
    ...metric,
    current: Math.round(clamp(withRandomOffset(metric.current, 10), 20, 220)),
    previous: Math.round(clamp(withRandomOffset(metric.previous, 10), 20, 220)),
    reviewScore: Math.round(clamp(withRandomOffset(metric.reviewScore, 5), 60, 100)),
  })),
  capabilityTree: payload.chartCapabilityTree.map((node) => ({
    ...node,
    value: Math.round(clamp(withRandomOffset(node.value, 8), 4, 140)),
    children: node.children?.map((child) => ({
      ...child,
      value: Math.round(clamp(withRandomOffset(child.value, 4), 2, 100)),
    })),
  })),
  categoryShare: payload.chartCategoryShare.map((share) => ({
    ...share,
    value: Math.round(clamp(withRandomOffset(share.value, 5), 1, 100)),
  })),
  qualityDistribution: payload.qualityPoints.map((point) => ({
    ...point,
    cycleTimeDays: Math.round(clamp(withRandomOffset(point.cycleTimeDays, 2), 1, 20)),
    defectRate: Number(clamp(withRandomOffset(point.defectRate, 0.45), 0.3, 10).toFixed(1)),
    complexity: Math.round(clamp(withRandomOffset(point.complexity, 1.2), 1, 10)),
  })),
  genderBoxPlot: payload.genderBoxPlotMetrics.map((metric) => ({
    ...metric,
    values: metric.values.map((value) =>
      Math.round(clamp(withRandomOffset(value, 3), 0, 160)),
    ),
  })),
  workflow: {
    ...payload.workflow,
    links: payload.workflow.links.map((link) => ({
      ...link,
      value: Math.round(clamp(withRandomOffset(link.value, 180), 0, 5000)),
    })),
  },
});

const buildOutlierHeavyBoxPlot = (
  metrics: GenderBoxPlotMetric[],
): GenderBoxPlotMetric[] =>
  metrics.map((metric) => {
    const sortedValues = [...metric.values].sort((first, second) => first - second);
    const lowBase = sortedValues[0] ?? 0;
    const highBase = sortedValues[sortedValues.length - 1] ?? 100;
    const lowOutlierCount = getRandomNumber(1, 2);
    const highOutlierCount = getRandomNumber(1, 3);
    const lowOutliers = Array.from({ length: lowOutlierCount }, () =>
      Math.max(0, getRandomNumber(lowBase - 34, lowBase - 10)),
    );
    const highOutliers = Array.from({ length: highOutlierCount }, () =>
      getRandomNumber(highBase + 14, highBase + 46),
    );
    const centeredValues = metric.values.map((value) =>
      Math.round(clamp(withRandomOffset(value, 5), 0, 160)),
    );

    return {
      ...metric,
      values: [...lowOutliers, ...centeredValues, ...highOutliers],
    };
  });

const buildEmptyWorkflow = (): WorkflowSankeyData => ({
  nodes: [],
  links: [],
});

const buildEmptyChartData = (): ChartShowcaseData => ({
  businessTrend: [],
  implementationTrend: [],
  capabilityTree: [],
  categoryShare: [],
  qualityDistribution: [],
  genderBoxPlot: [],
  workflow: buildEmptyWorkflow(),
});

const buildSmallSankeyWorkflow = (
  workflow: WorkflowSankeyData,
): WorkflowSankeyData => ({
  ...workflow,
  links: [
    { source: 'A', target: 'A-1', value: getRandomNumber(1180, 1520) },
    { source: 'C', target: 'A-1', value: getRandomNumber(360, 480) },
    { source: 'D2', target: 'A-1', value: getRandomNumber(42, 86) },
    { source: 'A', target: 'C-1', value: getRandomNumber(320, 420) },
    { source: 'C', target: 'C-1', value: getRandomNumber(310, 390) },
    { source: 'D2', target: 'C-1', value: 0 },
    { source: 'A', target: 'D2-1', value: getRandomNumber(24, 58) },
    { source: 'C', target: 'D2-1', value: getRandomNumber(3, 14) },
    { source: 'D2', target: 'D2-1', value: getRandomNumber(320, 430) },
  ],
});

const sankeySourceKeys = ['A', 'C', 'D2'] as const;
const sankeyTargetKeys = ['A-1', 'C-1', 'D2-1'] as const;

const buildZeroValueSankeyWorkflow = (
  workflow: WorkflowSankeyData,
): WorkflowSankeyData => {
  const visibleNodeCount = getRandomNumber(2, 5);
  const availablePairs = sankeySourceKeys.flatMap((_, sourceIndex) =>
    sankeyTargetKeys.flatMap((__, targetIndex) => {
      const sourceCount = sourceIndex + 1;
      const targetCount = targetIndex + 1;

      return sourceCount + targetCount === visibleNodeCount
        ? [{ sourceCount, targetCount }]
        : [];
    }),
  );
  const selectedPair =
    availablePairs[getRandomIndex(availablePairs.length)] ?? availablePairs[0];
  const visibleSources = getRandomItems(sankeySourceKeys, selectedPair.sourceCount);
  const visibleTargets = getRandomItems(sankeyTargetKeys, selectedPair.targetCount);

  return {
    ...workflow,
    links: workflow.links.map((link) => {
      const isVisibleLink =
        visibleSources.includes(link.source as typeof sankeySourceKeys[number]) &&
        visibleTargets.includes(link.target as typeof sankeyTargetKeys[number]);

      return {
        ...link,
        value: isVisibleLink ? getRandomNumber(180, 760) : 0,
      };
    }),
  };
};

const applyCardScenarios = (
  data: ChartShowcaseData,
  scenarios: ChartCardScenarioMap,
): ChartShowcaseData => {
  let nextData = data;

  if (scenarios.businessTrend === 'missingXAxis') {
    const missingIndex = getRandomIndex(nextData.businessTrend.length);

    nextData = {
      ...nextData,
      businessTrend: nextData.businessTrend.map((metric, index) =>
        index === missingIndex
          ? { ...metric, revenue: null, activeUsers: null, conversionRate: null }
          : metric,
      ),
    };
  }

  if (scenarios.businessTrend === 'zeroValues') {
    const zeroIndex = getRandomIndex(nextData.businessTrend.length);

    nextData = {
      ...nextData,
      businessTrend: nextData.businessTrend.map((metric, index) =>
        index === zeroIndex
          ? { ...metric, revenue: 0, activeUsers: 0, conversionRate: 0 }
          : metric,
      ),
    };
  }

  if (scenarios.implementationTrend === 'missingXAxis') {
    const missingIndex = getRandomIndex(nextData.implementationTrend.length);

    nextData = {
      ...nextData,
      implementationTrend: nextData.implementationTrend.map((metric, index) =>
        index === missingIndex
          ? { ...metric, current: null, previous: null, reviewScore: null }
          : metric,
      ),
    };
  }

  if (scenarios.implementationTrend === 'zeroValues') {
    const zeroIndex = getRandomIndex(nextData.implementationTrend.length);

    nextData = {
      ...nextData,
      implementationTrend: nextData.implementationTrend.map((metric, index) =>
        index === zeroIndex ? { ...metric, current: 0, previous: 0 } : metric,
      ),
    };
  }

  if (scenarios.categoryShare === 'zeroValues') {
    const zeroShareIndex = getRandomIndex(nextData.categoryShare.length);

    nextData = {
      ...nextData,
      categoryShare: nextData.categoryShare.map((share, index) => ({
        ...share,
        value: index === zeroShareIndex ? 0 : share.value,
      })),
    };
  }

  if (scenarios.categoryShare === 'singleSlice') {
    nextData = {
      ...nextData,
      categoryShare: [
        {
          name: nextData.categoryShare[0]?.name ?? 'ECharts based',
          value: 100,
        },
      ],
    };
  }

  if (scenarios.sankey === 'zeroValues') {
    nextData = {
      ...nextData,
      workflow: buildZeroValueSankeyWorkflow(nextData.workflow),
    };
  }

  if (scenarios.sankey === 'smallSankeyValues') {
    nextData = {
      ...nextData,
      workflow: buildSmallSankeyWorkflow(nextData.workflow),
    };
  }

  if (scenarios.genderBoxPlot === 'outlierHeavyBoxplot') {
    nextData = {
      ...nextData,
      genderBoxPlot: buildOutlierHeavyBoxPlot(nextData.genderBoxPlot),
    };
  }

  return nextData;
};

export const useChartShowcaseData = (
  payload: DashboardPayload,
  refreshKey = 0,
  globalScenario: GlobalChartScenarioId = 'normal',
  cardScenarios: ChartCardScenarioMap = {},
) =>
  useMemo(() => {
    void refreshKey;

    const randomizedData = buildRandomizedChartData(payload);

    return globalScenario === 'empty'
      ? buildEmptyChartData()
      : applyCardScenarios(randomizedData, cardScenarios);
  }, [payload, refreshKey, globalScenario, cardScenarios]);
