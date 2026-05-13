import type { FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PublicDataApiCopy, SectionCopy } from '../../i18n/dictionary';
import { useTourismSearch } from '../../hooks/useTourismSearch';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

interface ApiPlaygroundSectionProps {
  section: SectionCopy;
  copy: PublicDataApiCopy;
  dateTimeLocale: string;
}

const formatDateTime = (value: string | undefined, locale: string) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value));
};

export const ApiPlaygroundSection = ({
  section,
  copy,
  dateTimeLocale,
}: ApiPlaygroundSectionProps) => {
  const [tourismKeyword, setTourismKeyword] = useState('서울');
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const {
    items,
    total,
    hasNextPage,
    phase,
    error,
    meta,
    isLoading,
    isLoadingMore,
    runSearch,
    retry,
    cancelRequest,
    loadMore,
  } = useTourismSearch();

  const metaRows = useMemo(
    () => [
      {
        label: copy.metaLabels.requestId,
        value: meta ? `#${meta.requestId}` : '-',
      },
      {
        label: copy.metaLabels.keyword,
        value: meta?.keyword ?? tourismKeyword,
      },
      {
        label: copy.metaLabels.page,
        value: meta ? String(meta.page) : '-',
      },
      {
        label: copy.metaLabels.latency,
        value:
          typeof meta?.latencyMs === 'number'
            ? `${meta.latencyMs}${copy.latencyUnit}`
            : '-',
      },
      {
        label: copy.metaLabels.startedAt,
        value: formatDateTime(meta?.startedAt, dateTimeLocale),
      },
      {
        label: copy.metaLabels.completedAt,
        value: formatDateTime(meta?.completedAt, dateTimeLocale),
      },
    ],
    [copy, dateTimeLocale, meta, tourismKeyword],
  );

  const isRetryAvailable = phase === 'error' || phase === 'canceled';
  const shouldShowResults = items.length > 0;
  const isMissingKey = error?.code === 'MISSING_DATA_GO_KR_SERVICE_KEY';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch(tourismKeyword);
  };

  useEffect(() => {
    const sentinelNode = sentinelRef.current;

    if (!sentinelNode || !shouldShowResults || !hasNextPage) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && !isLoadingMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '240px 0px',
      },
    );

    observer.observe(sentinelNode);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, isLoadingMore, loadMore, shouldShowResults]);

  return (
    <Section
      id="api-playground"
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      actions={
        <div className="api-live-badges" aria-label={copy.responseCard.title}>
          <span>{copy.sourceBadge}</span>
          <span>{copy.endpointBadge}</span>
          <span>{copy.contractBadge}</span>
        </div>
      }
    >
      <div className="api-playground api-playground--public-only">
        <Card
          title={copy.searchCard.title}
          description={copy.searchCard.description}
        >
          <form className="api-playground__public-form" onSubmit={handleSubmit}>
            <label htmlFor="tourism-keyword">
              {copy.publicData.keywordLabel}
              <input
                id="tourism-keyword"
                value={tourismKeyword}
                placeholder={copy.publicData.keywordPlaceholder}
                disabled={isLoading}
                onChange={(event) => setTourismKeyword(event.target.value)}
              />
            </label>
            <div className="api-playground__controls">
              <button
                type="submit"
                disabled={isLoading || tourismKeyword.trim().length === 0}
              >
                {copy.publicData.searchLabel}
              </button>
              <button
                type="button"
                onClick={retry}
                disabled={isLoading || !isRetryAvailable}
              >
                {copy.retryLabel}
              </button>
              <button type="button" onClick={cancelRequest} disabled={!isLoading}>
                {copy.cancelLabel}
              </button>
            </div>
          </form>

          <div className="api-playground__notice api-playground__notice--warning">
            <strong>{copy.publicData.noticeTitle}</strong>
            <span>{copy.publicData.noticeDescription}</span>
          </div>

          <dl className="api-playground__meta api-playground__public-meta">
            {metaRows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card
          title={copy.responseCard.title}
          description={copy.responseCard.description}
          aside={
            <span className={`api-playground__phase api-playground__phase--${phase}`}>
              {copy.phaseLabels[phase]}
            </span>
          }
        >
          <div className="api-playground__response" aria-live="polite">
            {phase === 'idle' && (
              <div className="api-playground__state">
                <strong>{copy.idleTitle}</strong>
                <p>{copy.idleDescription}</p>
              </div>
            )}

            {phase === 'loading' && !isLoadingMore && (
              <div className="api-playground__state api-playground__state--loading">
                <span className="api-playground__spinner" aria-hidden="true" />
                <strong>{copy.loadingLabel}</strong>
              </div>
            )}

            {phase === 'empty' && (
              <div className="api-playground__state">
                <strong>{copy.publicData.emptyTitle}</strong>
                <p>{copy.publicData.emptyDescription}</p>
              </div>
            )}

            {phase === 'error' && error && (
              <div className="api-playground__state api-playground__state--error" role="alert">
                <strong>
                  {isMissingKey ? copy.publicData.missingKeyTitle : copy.errorTitle}
                </strong>
                <p>
                  {isMissingKey
                    ? copy.publicData.missingKeyDescription
                    : error.message}
                </p>
                <small>{`${error.code} · ${error.statusCode}`}</small>
              </div>
            )}

            {phase === 'canceled' && (
              <div className="api-playground__state">
                <strong>{copy.canceledTitle}</strong>
                <p>{copy.canceledDescription}</p>
              </div>
            )}

            {shouldShowResults && (
              <>
                <div className="api-playground__summary">
                  <span>{copy.publicData.totalLabel(items.length, total)}</span>
                  {isLoadingMore && <span>{copy.loadingMoreLabel}</span>}
                </div>
                <div className="tourism-result-grid">
                  {items.map((item) => (
                    <article className="tourism-result-card" key={item.id}>
                      <div className="tourism-result-card__image">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" loading="lazy" />
                        ) : (
                          <span>{copy.publicData.imageFallback}</span>
                        )}
                      </div>
                      <div className="tourism-result-card__body">
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.address || copy.publicData.addressFallback}</p>
                        </div>
                        <dl>
                          <div>
                            <dt>{copy.publicData.contentTypeLabel}</dt>
                            <dd>{item.contentTypeId}</dd>
                          </div>
                          <div>
                            <dt>{copy.publicData.regionLabel}</dt>
                            <dd>{item.regionCode}</dd>
                          </div>
                          <div>
                            <dt>{copy.publicData.modifiedLabel}</dt>
                            <dd>{formatDateTime(item.modifiedAt, dateTimeLocale)}</dd>
                          </div>
                        </dl>
                        <span className="tourism-result-card__source">
                          {copy.publicData.sourceLabel}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="api-playground__footer">
                  {hasNextPage && (
                    <div
                      ref={sentinelRef}
                      className="api-playground__sentinel"
                      aria-hidden="true"
                    />
                  )}
                  {isLoadingMore && <p>{copy.loadingMoreLabel}</p>}
                  {!hasNextPage && <p>{copy.endLabel}</p>}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
};
