import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ChartShowcaseSection } from './components/sections/ChartShowcaseSection';
import { DataTableSection } from './components/sections/DataTableSection';
import { OverviewSection } from './components/sections/OverviewSection';
import { SkillSummarySection } from './components/sections/SkillSummarySection';
import { TimelineShowcaseSection } from './components/sections/TimelineShowcaseSection';
import { dictionary } from './i18n/dictionary';
import { useDashboardData } from './hooks/useDashboardData';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useDashboardViewModel } from './hooks/useDashboardViewModel';
import type { Locale } from './types/dashboard';

const portfolioUrl = 'https://www.notion.so/329efa9a0f5f805ab6ecc52d4266a590';

const App = () => {
  const [locale, setLocale] = useState<Locale>('ko');
  const t = dictionary[locale];
  const { data, error, isLoading, refresh } = useDashboardData();
  const viewModel = useDashboardViewModel(data, t.dateTimeLocale);
  useScrollReveal(viewModel?.generatedAtLabel);

  const heroStats = [
    {
      label: t.heroStats.chartCases,
      value: viewModel?.payload.chartImplementationMetrics.length ?? '-',
    },
    {
      label: t.heroStats.timelineItems,
      value: viewModel?.payload.roadmapItems.length ?? '-',
    },
    {
      label: t.heroStats.gridRows,
      value: viewModel?.payload.portfolioGridRows.length ?? '-',
    },
  ];

  return (
    <AppLayout
      appName={t.appName}
      appSubtitle={t.appSubtitle}
      navItems={t.nav}
      locale={locale}
      languageLabel={t.languageLabel}
      onLocaleChange={setLocale}
    >
      <section className="profile-hero" aria-labelledby="hero-title" data-reveal>
        <div className="profile-hero__content">
          <p className="eyebrow">{t.heroEyebrow}</p>
          <h1
            id="hero-title"
            className={locale === 'ko' ? 'profile-hero__title--ko' : undefined}
          >
            {t.heroTitle}
          </h1>
          <p>{t.heroBody}</p>

          <div className="profile-hero__actions">
            <a className="button" href="#charts">
              {t.heroCtaLabel}
            </a>
            <a
              className="button button--ghost"
              href={portfolioUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t.portfolioLinkLabel}
            </a>
            <button
              className="button button--ghost"
              type="button"
              aria-label={t.refreshLabel}
              onClick={refresh}
            >
              {t.refreshLabel}
            </button>
          </div>

          <ul className="profile-hero__focus" aria-label={t.portfolioFocusLabel}>
            {t.portfolioFocus.map((item) => (
              <li className="tag" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="profile-hero__preview" aria-label={t.previewLabel}>
          <div className="profile-hero__preview-card">
            <div className="profile-hero__preview-head">
              <span>{t.previewTechLabel}</span>
              {viewModel && <small>{`${t.updatedLabel} ${viewModel.generatedAtLabel}`}</small>}
            </div>
            <div className="profile-hero__preview-body">
              <div className="profile-hero__bars" aria-hidden="true">
                {[46, 72, 58, 88, 64].map((height) => (
                  <span key={height} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="profile-hero__timeline" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
            <dl className="profile-hero__stats">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>

      {isLoading && !viewModel && <div className="loading-state">{t.loading}</div>}
      {error && (
        <div className="error-state" role="alert">
          <strong>{t.errorTitle}</strong>
          <p>{error}</p>
        </div>
      )}

      {viewModel && (
        <>
          <OverviewSection
            section={t.sections.overview}
            kpis={viewModel.payload.kpis}
            trendLabels={t.trendLabels}
          />
          <SkillSummarySection
            section={t.sections.skills}
            skills={viewModel.payload.skills}
          />
          <ChartShowcaseSection
            section={t.sections.charts}
            chartCards={t.chartCards}
            chartOptionLabels={t.chartOptions}
            sankeyCopy={t.sankey}
            payload={viewModel.payload}
          />
          <TimelineShowcaseSection
            section={t.sections.timeline}
            timelineCopy={t.timeline}
            groups={viewModel.payload.roadmapGroups}
            items={viewModel.payload.roadmapItems}
          />
          <DataTableSection
            section={t.sections.table}
            dataGridCard={t.dataGridCard}
            customGridCopy={t.customGrid}
            headers={t.tableHeaders}
            rows={viewModel.payload.deliveryRows}
            gridRows={viewModel.payload.portfolioGridRows}
          />
        </>
      )}
    </AppLayout>
  );
};

export default App;
