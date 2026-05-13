import type { EChartsOption } from 'echarts';
import type { ChartMetricValue } from '../../../types/dashboard';

export const axisTextColor = '#64717f';
export const splitLineColor = '#e4eaf0';
export const roundedBarTopRadius = [20, 20, 0, 0];
export const squareBarRadius = [0, 0, 0, 0];

export type ChartLegendSelection = Record<string, boolean>;

export interface StackedBarSeries {
  name: string;
  values: ChartMetricValue[];
}

export const buildNoDataGraphic = (text: string): EChartsOption['graphic'] => ({
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

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
