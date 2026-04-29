import type { RoadmapGroup, RoadmapItem } from '../../types/dashboard';
import type { SectionCopy, TimelineCopy } from '../../i18n/dictionary';
import { RoadmapTimeline } from '../../features/timeline/RoadmapTimeline';
import { Section } from '../ui/Section';

interface TimelineShowcaseSectionProps {
  section: SectionCopy;
  timelineCopy: TimelineCopy;
  groups: RoadmapGroup[];
  items: RoadmapItem[];
}

export const TimelineShowcaseSection = ({
  section,
  timelineCopy,
  groups,
  items,
}: TimelineShowcaseSectionProps) => (
  <Section
    id="timeline"
    eyebrow={section.eyebrow}
    title={section.title}
    description={section.description}
  >
    <RoadmapTimeline groups={groups} items={items} copy={timelineCopy} />
  </Section>
);
