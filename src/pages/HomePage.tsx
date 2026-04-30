import { OverviewSection } from '../components/sections/OverviewSection';
import { SkillSummarySection } from '../components/sections/SkillSummarySection';
import { Card } from '../components/ui/Card';
import { Section } from '../components/ui/Section';
import type { DashboardDictionary } from '../i18n/dictionary';
import type { DashboardPayload, Locale } from '../types/dashboard';

interface HeroStat {
  label: string;
  value: number | string;
}

interface HomePageProps {
  copy: DashboardDictionary;
  locale: Locale;
  payload?: DashboardPayload;
  generatedAtLabel?: string;
  heroStats: HeroStat[];
  portfolioUrl: string;
  onRefresh: () => void;
}

export const HomePage = ({
  copy,
  locale,
  payload,
  generatedAtLabel,
  heroStats,
  portfolioUrl,
  onRefresh,
}: HomePageProps) => (
  <>
    <section className="profile-hero" aria-labelledby="hero-title" data-reveal>
      <div className="profile-hero__content">
        <p className="eyebrow">{copy.heroEyebrow}</p>
        <h1
          id="hero-title"
          className={locale === 'ko' ? 'profile-hero__title--ko' : undefined}
        >
          {copy.heroTitle}
        </h1>
        <p>{copy.heroBody}</p>

        <div className="profile-hero__actions">
          <a className="button" href="#/charts">
            {copy.heroCtaLabel}
          </a>
          <a
            className="button button--ghost"
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
          >
            {copy.portfolioLinkLabel}
          </a>
          <button
            className="button button--ghost"
            type="button"
            aria-label={copy.refreshLabel}
            onClick={onRefresh}
          >
            {copy.refreshLabel}
          </button>
        </div>

        <ul className="profile-hero__focus" aria-label={copy.portfolioFocusLabel}>
          {copy.portfolioFocus.map((item) => (
            <li className="tag" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <aside className="profile-hero__preview" aria-label={copy.previewLabel}>
        <div className="profile-hero__preview-card">
          <div className="profile-hero__preview-head">
            <span>{copy.previewTechLabel}</span>
            {generatedAtLabel && (
              <small>{`${copy.updatedLabel} ${generatedAtLabel}`}</small>
            )}
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

    {payload && (
      <>
        <OverviewSection
          section={copy.sections.overview}
          kpis={payload.kpis}
          trendLabels={copy.trendLabels}
        />
        <SkillSummarySection section={copy.sections.skills} skills={payload.skills} />
      </>
    )}

    <Section
      id="demo-routes"
      eyebrow={copy.demoRoutes.eyebrow}
      title={copy.demoRoutes.title}
      description={copy.demoRoutes.description}
    >
      <div className="grid grid--3">
        <Card
          title={copy.sections.charts.title}
          description={copy.sections.charts.description}
        >
          <a className="demo-card__link" href="#/charts">
            {copy.demoRoutes.openLabel}
          </a>
        </Card>
        <Card
          title={copy.sections.table.title}
          description={copy.sections.table.description}
        >
          <a className="demo-card__link" href="#/data-grid">
            {copy.demoRoutes.openLabel}
          </a>
        </Card>
        <Card
          title={copy.sections.timeline.title}
          description={copy.sections.timeline.description}
        >
          <a className="demo-card__link" href="#/timeline">
            {copy.demoRoutes.openLabel}
          </a>
        </Card>
      </div>
    </Section>
  </>
);
