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
import { LabelLayout } from 'echarts/features';
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
  LabelLayout,
  SVGRenderer,
]);

interface EChartProps {
  option: EChartsOption;
  ariaLabel: string;
  fallbackDescription?: string;
  height?: number;
  onLegendSelectChanged?: (selected: Record<string, boolean>) => void;
  onSizeChange?: (size: ChartSize) => void;
  onMouseOver?: (params: unknown) => void;
  onMouseOut?: () => void;
}

interface LegendSelectChangedPayload {
  selected: Record<string, boolean>;
}

export interface ChartSize {
  width: number;
  height: number;
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
  onSizeChange,
  onMouseOver,
  onMouseOut,
}: EChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const legendSelectHandlerRef = useRef(onLegendSelectChanged);
  const sizeChangeHandlerRef = useRef(onSizeChange);
  const mouseOverHandlerRef = useRef(onMouseOver);
  const mouseOutHandlerRef = useRef(onMouseOut);
  const fallbackId = useId();

  useEffect(() => {
    legendSelectHandlerRef.current = onLegendSelectChanged;
  }, [onLegendSelectChanged]);

  useEffect(() => {
    sizeChangeHandlerRef.current = onSizeChange;
  }, [onSizeChange]);

  useEffect(() => {
    mouseOverHandlerRef.current = onMouseOver;
  }, [onMouseOver]);

  useEffect(() => {
    mouseOutHandlerRef.current = onMouseOut;
  }, [onMouseOut]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const chart = echarts.init(containerRef.current, undefined, { renderer: 'svg' });
    chartRef.current = chart;

    const syncSize = () => {
      chart.resize();
      sizeChangeHandlerRef.current?.({
        width: chart.getWidth(),
        height: chart.getHeight(),
      });
    };

    const resizeObserver = new ResizeObserver(syncSize);
    const handleLegendSelectChanged = (params: unknown) => {
      if (isLegendSelectChangedPayload(params)) {
        legendSelectHandlerRef.current?.(params.selected);
      }
    };
    const handleMouseOver = (params: unknown) => {
      mouseOverHandlerRef.current?.(params);
    };
    const handleMouseOut = () => {
      mouseOutHandlerRef.current?.();
    };

    resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', syncSize);
    chart.on('legendselectchanged', handleLegendSelectChanged);
    chart.on('mouseover', handleMouseOver);
    chart.on('mouseout', handleMouseOut);
    syncSize();

    return () => {
      window.removeEventListener('resize', syncSize);
      chart.off('legendselectchanged', handleLegendSelectChanged);
      chart.off('mouseover', handleMouseOver);
      chart.off('mouseout', handleMouseOut);
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
