import { useEffect, useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { dictionary } from './i18n/dictionary';
import { useDashboardData } from './hooks/useDashboardData';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useDashboardViewModel } from './hooks/useDashboardViewModel';
import { ChartsPage } from './pages/ChartsPage';
import { DataGridPage } from './pages/DataGridPage';
import { HomePage } from './pages/HomePage';
import { TimelinePage } from './pages/TimelinePage';
import type { AppRoutePath, Locale } from './types/dashboard';

const portfolioUrl = 'https://www.notion.so/329efa9a0f5f805ab6ecc52d4266a590';
const routePaths: readonly AppRoutePath[] = [
  '/',
  '/charts',
  '/data-grid',
  '/timeline',
];

const isAppRoutePath = (value: string): value is AppRoutePath =>
  routePaths.includes(value as AppRoutePath);

const getCurrentRoutePath = (): AppRoutePath => {
  const hashPath = window.location.hash.replace(/^#/, '') || '/';

  return isAppRoutePath(hashPath) ? hashPath : '/';
};

const useHashRoute = () => {
  const [routePath, setRoutePath] = useState<AppRoutePath>(getCurrentRoutePath);

  useEffect(() => {
    const handleHashChange = () => {
      setRoutePath(getCurrentRoutePath());
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [routePath]);

  return routePath;
};

const App = () => {
  const [locale, setLocale] = useState<Locale>('ko');
  const routePath = useHashRoute();
  const t = dictionary[locale];
  const { data, error, isLoading, refresh } = useDashboardData();
  const viewModel = useDashboardViewModel(data, t.dateTimeLocale);
  useScrollReveal(`${routePath}-${locale}-${viewModel?.generatedAtLabel ?? 'pending'}`);

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

  const renderPage = () => {
    if (routePath === '/charts') {
      return <ChartsPage copy={t} payload={viewModel?.payload} />;
    }

    if (routePath === '/data-grid') {
      return <DataGridPage copy={t} payload={viewModel?.payload} />;
    }

    if (routePath === '/timeline') {
      return <TimelinePage copy={t} payload={viewModel?.payload} />;
    }

    return (
      <HomePage
        copy={t}
        locale={locale}
        payload={viewModel?.payload}
        generatedAtLabel={viewModel?.generatedAtLabel}
        heroStats={heroStats}
        portfolioUrl={portfolioUrl}
        onRefresh={refresh}
      />
    );
  };

  return (
    <AppLayout
      appName={t.appName}
      appSubtitle={t.appSubtitle}
      navItems={t.nav}
      currentPath={routePath}
      locale={locale}
      languageLabel={t.languageLabel}
      navigationLabel={t.navigationLabel}
      homeLabel={t.homeLabel}
      onLocaleChange={setLocale}
    >
      {renderPage()}
      {isLoading && !viewModel && <div className="loading-state">{t.loading}</div>}
      {error && (
        <div className="error-state" role="alert">
          <strong>{t.errorTitle}</strong>
          <p>{error}</p>
        </div>
      )}

    </AppLayout>
  );
};

export default App;
