import { useEffect, useRef } from 'react';
import { BarChart, LineChart, SankeyChart, ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  LineChart,
  SankeyChart,
  ScatterChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

interface EChartProps {
  option: EChartsOption;
  ariaLabel: string;
  height?: number;
}

export const EChart = ({ option, ariaLabel, height = 320 }: EChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const resize = () => {
      chart.resize();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
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
        style={{ height }}
      />
    </div>
  );
};
