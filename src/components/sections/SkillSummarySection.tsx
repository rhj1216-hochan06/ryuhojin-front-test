import type { CapabilitySummary } from '../../types/dashboard';
import type { SectionCopy } from '../../i18n/dictionary';
import { Card } from '../common/Card';
import { Section } from '../common/Section';

interface SkillSummarySectionProps {
  section: SectionCopy;
  capabilities: CapabilitySummary[];
}

export const SkillSummarySection = ({
  section,
  capabilities,
}: SkillSummarySectionProps) => (
  <Section
    id="skills"
    eyebrow={section.eyebrow}
    title={section.title}
    description={section.description}
  >
    <Card>
      <div className="capability-list">
        {capabilities.map((capability) => (
          <div className="capability-row" key={capability.id}>
            <strong>{capability.category}</strong>
            <ul>
              {capability.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  </Section>
);
