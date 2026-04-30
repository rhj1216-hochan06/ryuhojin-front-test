import type { PropsWithChildren } from 'react';
import type { AppRoutePath, Locale, NavigationItem } from '../../types/dashboard';

interface AppLayoutProps {
  appName: string;
  appSubtitle: string;
  navItems: NavigationItem[];
  currentPath: AppRoutePath;
  locale: Locale;
  languageLabel: string;
  navigationLabel: string;
  homeLabel: string;
  onLocaleChange: (locale: Locale) => void;
}

export const AppLayout = ({
  appName,
  appSubtitle,
  navItems,
  currentPath,
  locale,
  languageLabel,
  navigationLabel,
  homeLabel,
  onLocaleChange,
  children,
}: PropsWithChildren<AppLayoutProps>) => (
  <div className="app-shell">
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#/" aria-label={homeLabel}>
          <span className="brand__mark" aria-hidden="true">
            RHJ
          </span>
          <span>
            <strong>{appName}</strong>
            <small>{appSubtitle}</small>
          </span>
        </a>
        <nav className="site-nav" aria-label={navigationLabel}>
          {navItems.map((item) => (
            <a
              key={item.id}
              className={currentPath === item.path ? 'is-active' : undefined}
              href={item.href}
              aria-current={currentPath === item.path ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="language-toggle" aria-label={languageLabel}>
          {(['ko', 'en'] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={locale === item ? 'is-active' : undefined}
              aria-pressed={locale === item}
              onClick={() => onLocaleChange(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
    <main id="top">{children}</main>
  </div>
);
