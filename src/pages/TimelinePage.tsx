import { TimelineShowcaseSection } from '../components/sections/TimelineShowcaseSection';
import type { DashboardDictionary } from '../i18n/dictionary';
import type { DashboardPayload } from '../types/dashboard';
import { PageIntro } from './PageIntro';

interface TimelinePageProps {
  copy: DashboardDictionary;
  payload?: DashboardPayload;
}

export const TimelinePage = ({ copy, payload }: TimelinePageProps) => (
  <>
    <PageIntro id="timeline-page" copy={copy.pages.timeline} />
    {payload && (
      <TimelineShowcaseSection
        section={copy.sections.timeline}
        timelineCopy={copy.timeline}
        groups={payload.roadmapGroups}
        items={payload.roadmapItems}
      />
    )}
  </>
);
