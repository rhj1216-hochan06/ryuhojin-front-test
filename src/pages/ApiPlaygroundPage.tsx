import { ApiPlaygroundSection } from '../components/sections/ApiPlaygroundSection';
import type { DashboardDictionary } from '../i18n/dictionary';
import { PageIntro } from './PageIntro';

interface ApiPlaygroundPageProps {
  copy: DashboardDictionary;
}

export const ApiPlaygroundPage = ({ copy }: ApiPlaygroundPageProps) => (
  <>
    <PageIntro id="api-playground-page" copy={copy.pages.apiPlayground} />
    <ApiPlaygroundSection
      section={copy.sections.apiPlayground}
      copy={copy.apiPlayground}
      dateTimeLocale={copy.dateTimeLocale}
    />
  </>
);
