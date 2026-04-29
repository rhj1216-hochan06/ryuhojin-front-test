import type { KpiMetric } from '../../types/dashboard';
import { MetricCard } from '../ui/MetricCard';
import { Section } from '../ui/Section';
import type { SectionCopy } from '../../i18n/dictionary';

interface OverviewSectionProps {
  section: SectionCopy;
  kpis: KpiMetric[];
  trendLabels: Record<KpiMetric['trend'], string>;
}

export const OverviewSection = ({
  section,
  kpis,
  trendLabels,
}: OverviewSectionProps) => (
  <Section
    id="overview"
    eyebrow={section.eyebrow}
    title={section.title}
    description={section.description}
  >
    <div className="grid grid--4">
      {kpis.map((metric) => (
        <MetricCard key={metric.id} metric={metric} trendLabels={trendLabels} />
      ))}
    </div>
  </Section>
);
