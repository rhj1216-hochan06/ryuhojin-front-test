import { useEffect, useId, useRef } from 'react';
import {
  BarChart,
  BoxplotChart,
  LineChart,
  PieChart,
  SankeyChart,
  ScatterChart,
  TreemapChart,
} from 'echarts/charts';
import {
  AriaComponent,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  BoxplotChart,
  LineChart,
  PieChart,
  SankeyChart,
  ScatterChart,
  TreemapChart,
  AriaComponent,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  SVGRenderer,
]);

interface EChartProps {
  option: EChartsOption;
  ariaLabel: string;
  fallbackDescription?: string;
  height?: number;
  onLegendSelectChanged?: (selected: Record<string, boolean>) => void;
}

interface LegendSelectChangedPayload {
  selected: Record<string, boolean>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isLegendSelection = (value: unknown): value is Record<string, boolean> =>
  isRecord(value) &&
  Object.values(value).every((selection) => typeof selection === 'boolean');

const isLegendSelectChangedPayload = (
  value: unknown,
): value is LegendSelectChangedPayload =>
  isRecord(value) && isLegendSelection(value.selected);

export const EChart = ({
  option,
  ariaLabel,
  fallbackDescription,
  height = 320,
  onLegendSelectChanged,
}: EChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const legendSelectHandlerRef = useRef(onLegendSelectChanged);
  const fallbackId = useId();

  useEffect(() => {
    legendSelectHandlerRef.current = onLegendSelectChanged;
  }, [onLegendSelectChanged]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const chart = echarts.init(containerRef.current, undefined, { renderer: 'svg' });
    chartRef.current = chart;

    const resize = () => {
      chart.resize();
    };

    const resizeObserver = new ResizeObserver(resize);
    const handleLegendSelectChanged = (params: unknown) => {
      if (isLegendSelectChangedPayload(params)) {
        legendSelectHandlerRef.current?.(params.selected);
      }
    };

    resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', resize);
    chart.on('legendselectchanged', handleLegendSelectChanged);

    return () => {
      window.removeEventListener('resize', resize);
      chart.off('legendselectchanged', handleLegendSelectChanged);
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return (
    <div className="chart-frame">
      <div
        ref={containerRef}
        className="chart-canvas"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={fallbackId}
        style={{ height }}
      />
      <p id={fallbackId} className="sr-only">
        {fallbackDescription ?? ariaLabel}
      </p>
    </div>
  );
};
