import type { FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TourismPlace } from '../../apis/tourism/type';
import type { PublicDataApiCopy, SectionCopy } from '../../i18n/dictionary';
import { useTourismSearch } from '../../hooks/useTourismSearch';
import { useTourismCommonDetailQuery } from '../../query/apiTest/useTourismCommonDetailQuery';
import { normalizeApiRequestError } from '../../utils/apiError';
import { Card } from '../common/Card';
import { Dialog } from '../common/Dialog';
import { Section } from '../common/Section';

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

const formatDate = (value: string | undefined, locale: string) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
};

const formatContentTypeSummary = (
  place: TourismPlace,
  copy: PublicDataApiCopy,
) =>
  `${copy.publicData.contentTypeCodeLabel} ${place.contentTypeId} / ${copy.publicData.multilingualCodeLabel} ${place.contentTypeMultilingualCode}`;

const ApiLanguageNotice = ({
  copy,
  className,
}: {
  copy: PublicDataApiCopy;
  className?: string;
}) => (
  <button
    type="button"
    className={['api-language-notice', className].filter(Boolean).join(' ')}
    aria-label={`${copy.publicData.languageNoticeLabel}: ${copy.publicData.languageNoticeTooltip}`}
  >
    <span className="api-language-notice__icon" aria-hidden="true">
      i
    </span>
    <span className="api-language-notice__tooltip" role="tooltip">
      <strong>{copy.publicData.languageNoticeLabel}</strong>
      <span>{copy.publicData.languageNoticeTooltip}</span>
    </span>
  </button>
);

export const ApiPlaygroundSection = ({
  section,
  copy,
  dateTimeLocale,
}: ApiPlaygroundSectionProps) => {
  const [tourismKeyword, setTourismKeyword] = useState('서울');
  const [dialogPlaceId, setDialogPlaceId] = useState<string | null>(null);
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

  const shouldShowResults = items.length > 0;
  const isMissingKey = error?.code === 'MISSING_DATA_GO_KR_SERVICE_KEY';
  const shouldShowApiLanguageNotice = dateTimeLocale
    .toLowerCase()
    .startsWith('en');
  const dialogPlace = items.find((item) => item.id === dialogPlaceId) ?? null;
  const detailQuery = useTourismCommonDetailQuery(dialogPlace?.id);
  const detailError = detailQuery.error
    ? normalizeApiRequestError(detailQuery.error)
    : null;
  const dialogDetail = detailQuery.data?.data ?? null;
  const dialogDisplayPlace = dialogDetail ?? dialogPlace;
  const dialogImageUrl =
    dialogDetail?.imageUrl ??
    dialogDetail?.thumbnailImageUrl ??
    dialogPlace?.imageUrl;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch(tourismKeyword);
  };

  const closeDialog = () => {
    setDialogPlaceId(null);
  };

  useEffect(() => {
    const sentinelNode = sentinelRef.current;

    if (!sentinelNode || !shouldShowResults || !hasNextPage || dialogPlaceId) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !isLoading &&
          !isLoadingMore &&
          !dialogPlaceId
        ) {
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
  }, [
    dialogPlaceId,
    hasNextPage,
    isLoading,
    isLoadingMore,
    loadMore,
    shouldShowResults,
  ]);

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
                  {shouldShowApiLanguageNotice && (
                    <ApiLanguageNotice copy={copy} />
                  )}
                  {isLoadingMore && <span>{copy.loadingMoreLabel}</span>}
                </div>
                <div className="tourism-result-grid">
                  {items.map((item) => (
                    <button
                      type="button"
                      className="tourism-result-card"
                      key={item.id}
                      onClick={() => setDialogPlaceId(item.id)}
                    >
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
                        <span className="tourism-result-card__type">
                          {item.contentTypeName}
                        </span>
                      </div>
                    </button>
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
      <Dialog
        open={Boolean(dialogPlace)}
        titleId="tourism-result-dialog-title"
        closeLabel={copy.publicData.detailCloseLabel}
        onClose={closeDialog}
        surfaceClassName="tourism-result-dialog__surface"
      >
        {dialogPlace && dialogDisplayPlace && (
          <>
            <div className="tourism-result-dialog__media">
              {dialogImageUrl ? (
                <img src={dialogImageUrl} alt="" />
              ) : (
                <span>{copy.publicData.imageFallback}</span>
              )}
            </div>
            <div className="tourism-result-detail">
              <div className="tourism-result-detail__header">
                <div>
                  <div className="tourism-result-detail__eyebrow-row">
                    <span>{copy.publicData.detailEyebrow}</span>
                    {shouldShowApiLanguageNotice && (
                      <ApiLanguageNotice
                        copy={copy}
                        className="api-language-notice--dialog"
                      />
                    )}
                  </div>
                  <strong id="tourism-result-dialog-title">
                    {dialogDisplayPlace.title}
                  </strong>
                </div>
              </div>
              {detailQuery.isFetching && (
                <div className="tourism-result-detail__status">
                  <span className="api-playground__spinner" aria-hidden="true" />
                  <strong>{copy.publicData.detailLoadingLabel}</strong>
                </div>
              )}
              {detailError && (
                <div
                  className="tourism-result-detail__status tourism-result-detail__status--error"
                  role="alert"
                >
                  <strong>{copy.publicData.detailErrorTitle}</strong>
                  <p>{detailError.message}</p>
                </div>
              )}
              <dl>
                <div className="tourism-result-detail__item--wide tourism-result-detail__item--primary">
                  <dt>{copy.publicData.addressDetailLabel}</dt>
                  <dd>
                    {[dialogDisplayPlace.address, dialogDisplayPlace.addressDetail]
                      .filter(Boolean)
                      .join(' ') || copy.publicData.addressFallback}
                  </dd>
                </div>
                <div>
                  <dt>{copy.publicData.contentTypeLabel}</dt>
                  <dd>
                    {dialogDisplayPlace.contentTypeName}
                    <small>{formatContentTypeSummary(dialogDisplayPlace, copy)}</small>
                  </dd>
                </div>
                <div>
                  <dt>{copy.publicData.classificationLabel}</dt>
                  <dd>{dialogDisplayPlace.classificationPath}</dd>
                </div>
                {dialogDetail && (
                  <div className="tourism-result-detail__item--wide tourism-result-detail__overview">
                    <dt>{copy.publicData.overviewLabel}</dt>
                    <dd>{dialogDetail.overview || '-'}</dd>
                  </div>
                )}
                <div>
                  <dt>{copy.publicData.coordinatesLabel}</dt>
                  <dd>
                    {typeof dialogDisplayPlace.mapX === 'number' &&
                    typeof dialogDisplayPlace.mapY === 'number' &&
                    dialogDisplayPlace.naverMapUrl ? (
                      <>
                        <a
                          className="tourism-result-detail__map-link"
                          href={dialogDisplayPlace.naverMapUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={copy.publicData.mapLinkAriaLabel(
                            dialogDisplayPlace.title,
                          )}
                        >
                          {`${dialogDisplayPlace.mapY.toFixed(5)}, ${dialogDisplayPlace.mapX.toFixed(5)}`}
                        </a>
                        <small>{copy.publicData.mapLinkLabel}</small>
                      </>
                    ) : (
                      copy.publicData.coordinatesFallback
                    )}
                  </dd>
                </div>
                {dialogDetail && (
                  <>
                    <div>
                      <dt>{copy.publicData.zipCodeLabel}</dt>
                      <dd>{dialogDetail.zipCode}</dd>
                    </div>
                    <div>
                      <dt>{copy.publicData.phoneLabel}</dt>
                      <dd>
                        {dialogDetail.phone || '-'}
                        {dialogDetail.phoneName && (
                          <small>{dialogDetail.phoneName}</small>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>{copy.publicData.createdLabel}</dt>
                      <dd>{formatDate(dialogDetail.createdAt, dateTimeLocale)}</dd>
                    </div>
                    <div className="tourism-result-detail__item--wide">
                      <dt>{copy.publicData.homepageLabel}</dt>
                      <dd>
                        {dialogDetail.homepageLinks.length > 0 ? (
                          <span className="tourism-result-detail__link-list">
                            {dialogDetail.homepageLinks.map((link) => (
                              <a
                                className="tourism-result-detail__map-link"
                                href={link.url}
                                key={`${link.label}-${link.url}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {link.label}
                              </a>
                            ))}
                          </span>
                        ) : (
                          dialogDetail.homepageText || '-'
                        )}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
              <div className="tourism-result-detail__footer">
                <span>
                  {dialogDetail
                    ? copy.publicData.detailSourceLabel
                    : copy.publicData.sourceLabel}
                </span>
                <span>
                  {copy.publicData.modifiedLabel}
                  {' '}
                  {formatDate(dialogDisplayPlace.modifiedAt, dateTimeLocale)}
                </span>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </Section>
  );
};
