import type { RoadmapGroup, RoadmapItem } from '../../types/dashboard';
import { RoadmapTimeline } from '../../features/timeline/RoadmapTimeline';
import { Section } from '../ui/Section';

interface TimelineShowcaseSectionProps {
  section: {
    eyebrow: string;
    title: string;
    description: string;
  };
  groups: RoadmapGroup[];
  items: RoadmapItem[];
}

export const TimelineShowcaseSection = ({
  section,
  groups,
  items,
}: TimelineShowcaseSectionProps) => (
  <Section
    id="timeline"
    eyebrow={section.eyebrow}
    title={section.title}
    description={section.description}
  >
    <RoadmapTimeline groups={groups} items={items} />
  </Section>
);

