import type { EChartsOption, LabelLayoutOptionCallbackParams } from 'echarts';
import type { ChartOptionLabels } from '../../../../i18n/dictionary';
import type { ChartCategoryShare } from '../../../../types/dashboard';
import type { ChartSize } from '../../EChart';
import { buildNoDataGraphic } from '../shared';

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

const generateOption = (
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

export default generateOption;
