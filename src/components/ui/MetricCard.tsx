import type { KpiMetric } from '../../types/dashboard';

const trendLabel: Record<KpiMetric['trend'], string> = {
  up: 'Improving',
  down: 'Reduced',
  flat: 'Steady',
};

interface MetricCardProps {
  metric: KpiMetric;
}

export const MetricCard = ({ metric }: MetricCardProps) => (
  <article className="metric-card">
    <div>
      <p>{metric.label}</p>
      <strong>{metric.value}</strong>
    </div>
    <span className={`trend trend--${metric.trend}`}>{trendLabel[metric.trend]}</span>
    <small>{metric.helper}</small>
  </article>
);

