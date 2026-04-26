import type { KpiMetric } from '../../types/dashboard';
import { MetricCard } from '../ui/MetricCard';
import { Section } from '../ui/Section';

interface OverviewSectionProps {
  section: {
    eyebrow: string;
    title: string;
    description: string;
  };
  kpis: KpiMetric[];
}

export const OverviewSection = ({ section, kpis }: OverviewSectionProps) => (
  <Section
    id="overview"
    eyebrow={section.eyebrow}
    title={section.title}
    description={section.description}
  >
    <div className="grid grid--4">
      {kpis.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  </Section>
);

