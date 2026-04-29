import type { SkillSummary } from '../../types/dashboard';
import type { SectionCopy } from '../../i18n/dictionary';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

interface SkillSummarySectionProps {
  section: SectionCopy;
  skills: SkillSummary[];
}

export const SkillSummarySection = ({
  section,
  skills,
}: SkillSummarySectionProps) => (
  <Section
    id="skills"
    eyebrow={section.eyebrow}
    title={section.title}
    description={section.description}
  >
    <Card>
      <div className="progress-list">
        {skills.map((skill) => (
          <div className="progress-row" key={skill.id}>
            <div className="progress-row__label">
              <span>{skill.category}</span>
              <span>{skill.level}%</span>
            </div>
            <div className="progress-track" aria-label={`${skill.category} ${skill.level}%`}>
              <span style={{ width: `${skill.level}%` }} />
            </div>
            <p className="skill-highlights">{skill.highlights.join(' · ')}</p>
          </div>
        ))}
      </div>
    </Card>
  </Section>
);
