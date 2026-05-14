import type { ProblemSummary } from '../../types/dashboard';
import { Section } from '../common/Section';
import type { SectionCopy } from '../../i18n/dictionary';

interface OverviewSectionProps {
  section: SectionCopy;
  problems: ProblemSummary[];
}

export const OverviewSection = ({
  section,
  problems,
}: OverviewSectionProps) => (
  <Section
    id="overview"
    eyebrow={section.eyebrow}
    title={section.title}
    description={section.description}
  >
    <div className="grid grid--4">
      {problems.map((problem) => (
        <article className="metric-card" key={problem.id}>
          <div>
            <p>{problem.label}</p>
            <strong>{problem.value}</strong>
          </div>
          <small>{problem.helper}</small>
        </article>
      ))}
    </div>
  </Section>
);
