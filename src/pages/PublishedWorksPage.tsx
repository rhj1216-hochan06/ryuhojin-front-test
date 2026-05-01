import { PublishedWorksSection } from '../components/sections/PublishedWorksSection';
import type { DashboardDictionary } from '../i18n/dictionary';
import { publishedWorksByLocale } from '../mocks/publishedWorks';
import type { Locale } from '../types/dashboard';
import { PageIntro } from './PageIntro';

interface PublishedWorksPageProps {
  copy: DashboardDictionary;
  locale: Locale;
}

export const PublishedWorksPage = ({ copy, locale }: PublishedWorksPageProps) => (
  <>
    <PageIntro id="works-page" copy={copy.pages.works} />
    <PublishedWorksSection
      section={copy.sections.publishedWorks}
      copy={copy.publishedWorks}
      works={publishedWorksByLocale[locale]}
    />
  </>
);
