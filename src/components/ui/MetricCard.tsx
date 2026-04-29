import type { KpiMetric } from '../../types/dashboard';

interface MetricCardProps {
  metric: KpiMetric;
  trendLabels: Record<KpiMetric['trend'], string>;
}

export const MetricCard = ({ metric, trendLabels }: MetricCardProps) => (
  <article className="metric-card">
    <div>
      <p>{metric.label}</p>
      <strong>{metric.value}</strong>
    </div>
    <span className={`trend trend--${metric.trend}`}>{trendLabels[metric.trend]}</span>
    <small>{metric.helper}</small>
  </article>
);
