import { ChartShowcaseSection } from '../components/sections/ChartShowcaseSection';
import type { DashboardDictionary } from '../i18n/dictionary';
import type { DashboardPayload } from '../types/dashboard';
import { PageIntro } from './PageIntro';

interface ChartsPageProps {
  copy: DashboardDictionary;
  payload?: DashboardPayload;
}

export const ChartsPage = ({ copy, payload }: ChartsPageProps) => (
  <>
    <PageIntro id="charts-page" copy={copy.pages.charts} />
    {payload && (
      <ChartShowcaseSection
        section={copy.sections.charts}
        chartCards={copy.chartCards}
        chartOptionLabels={copy.chartOptions}
        sankeyCopy={copy.sankey}
        payload={payload}
      />
    )}
  </>
);
