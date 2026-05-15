import type { FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  tourismPortalErrorCodes,
  tourismProviderResultCodes,
} from '../../assests/data/tourismApiManual';
import type { TourismPlace } from '../../apis/tourism/type';
import type { PublicDataApiCopy, SectionCopy } from '../../i18n/dictionary';
import { useTourismSearch } from '../../hooks/useTourismSearch';
import { useTourismCommonDetailQuery } from '../../query/apiTest/useTourismCommonDetailQuery';
import type { ApiDemoScenarioId, ApiDemoServiceError } from '../../types/dashboard';
import { normalizeApiRequestError } from '../../utils/apiError';
import { Card } from '../common/Card';
import { Dialog } from '../common/Dialog';
import { Section } from '../common/Section';
import { TogglePanel } from '../common/TogglePanel';

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

const apiDemoScenarioIds: ApiDemoScenarioId[] = [
  'live',
  'serviceError',
  'networkError',
  'timeout',
  'empty',
];

type ServiceErrorOption = ApiDemoServiceError & {
  id: string;
};

const getProviderErrorCode = (code: string) =>
  tourismProviderResultCodes.find((errorCode) => errorCode.code === code);

const getPortalErrorCode = (code: string) =>
  tourismPortalErrorCodes.find((errorCode) => errorCode.code === code);

const createServiceErrorOption = ({
  source,
  code,
  testCase,
}: {
  source: ServiceErrorOption['source'];
  code: string;
  testCase: ServiceErrorOption['testCase'];
}): ServiceErrorOption | null => {
  const manualError =
    source === 'provider'
      ? getProviderErrorCode(code)
      : getPortalErrorCode(code);

  if (!manualError) {
    return null;
  }

  return {
    id: `${source}:${manualError.code}`,
    source,
    code: manualError.code,
    message: manualError.message,
    description: manualError.description,
    testCase,
  };
};

const serviceErrorOptions = [
  createServiceErrorOption({
    source: 'provider',
    code: '11',
    testCase: 'missingMobileOs',
  }),
  createServiceErrorOption({
    source: 'portal',
    code: '30',
    testCase: 'invalidServiceKey',
  }),
].filter((option): option is ServiceErrorOption => Boolean(option));

const unavailableServiceErrorOptions = [
  ...tourismProviderResultCodes
    .filter((errorCode) => errorCode.code !== '00')
    .map((errorCode) => ({
      id: `provider:${errorCode.code}`,
      source: 'provider' as const,
      code: errorCode.code,
      message: errorCode.message,
      description: errorCode.description,
    })),
  ...tourismPortalErrorCodes.map((errorCode) => ({
    id: `portal:${errorCode.code}`,
    source: 'portal' as const,
    code: errorCode.code,
    message: errorCode.message,
    description: errorCode.description,
  })),
].filter(
  (errorCode) =>
    !serviceErrorOptions.some((option) => option.id === errorCode.id),
);

const defaultServiceErrorId = 'portal:30';
const fallbackServiceError = serviceErrorOptions[0] ?? {
  id: defaultServiceErrorId,
  source: 'portal' as const,
  code: '30',
  message: 'SERVICE_KEY_IS_NOT_REGISTERED_ERROR',
  description: '등록되지 않은 서비스키',
  testCase: 'invalidServiceKey' as const,
};

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

const ApiScenarioInfoTooltip = ({
  label,
  tooltip,
}: {
  label: string;
  tooltip: string;
}) => (
  <span
    className="api-scenario-info"
    aria-label={`${label}: ${tooltip}`}
  >
    <span className="api-scenario-info__icon" aria-hidden="true">
      i
    </span>
    <span className="api-scenario-info__tooltip" role="tooltip">
      {tooltip}
    </span>
  </span>
);

export const ApiPlaygroundSection = ({
  section,
  copy,
  dateTimeLocale,
}: ApiPlaygroundSectionProps) => {
  const [tourismKeyword, setTourismKeyword] = useState('서울');
  const [demoScenario, setDemoScenario] =
    useState<ApiDemoScenarioId>('live');
  const [serviceErrorId, setServiceErrorId] =
    useState(defaultServiceErrorId);
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
  } = useTourismSearch({ demoScenario });

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
  const selectedScenario = copy.failureDemo.options[demoScenario];
  const selectedServiceError =
    serviceErrorOptions.find((option) => option.id === serviceErrorId) ??
    fallbackServiceError;
  const selectedServiceErrorLabel =
    `${selectedServiceError.source === 'provider' ? '제공기관' : '공통'} ${selectedServiceError.code} · ${selectedServiceError.description}`;
  const errorRecovery = isMissingKey
    ? copy.publicData.missingKeyDescription
    : demoScenario === 'serviceError'
      ? selectedScenario.recovery
      : selectedScenario.recovery;
  const scenarioKeyword =
    demoScenario === 'empty' ? copy.failureDemo.emptyKeyword : tourismKeyword;
  const canRetrySearch = scenarioKeyword.trim().length > 0 && !isLoading;
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

  const requestLogMessage = (() => {
    if (phase === 'idle') {
      return copy.requestLog.idleMessage;
    }

    if (phase === 'loading') {
      return copy.requestLog.loadingMessage;
    }

    if (error) {
      if (demoScenario === 'serviceError' && !isMissingKey) {
        return `resultCode ${selectedServiceError.code} (${selectedServiceError.message}) · ${selectedServiceError.description}`;
      }

      return error.message;
    }

    if (demoScenario === 'serviceError') {
      return `resultCode ${selectedServiceError.code} (${selectedServiceError.message}) · ${selectedServiceError.description}`;
    }

    if (demoScenario !== 'live') {
      return selectedScenario.logMessage;
    }

    if (phase === 'success') {
      return copy.requestLog.successMessage(items.length, total);
    }

    if (phase === 'empty') {
      return copy.requestLog.emptyMessage;
    }

    return copy.requestLog.idleMessage;
  })();

  const requestLogRecovery = (() => {
    if (phase === 'idle' || phase === 'loading') {
      return copy.requestLog.notApplicable;
    }

    if (phase === 'success') {
      return copy.requestLog.noActionNeeded;
    }

    if (isMissingKey) {
      return copy.publicData.missingKeyDescription;
    }

    if (demoScenario === 'serviceError') {
      return selectedScenario.recovery;
    }

    return selectedScenario.recovery;
  })();

  const requestLogRows = [
    {
      label: copy.requestLog.labels.endpoint,
      value: copy.endpointBadge,
    },
    {
      label: copy.requestLog.labels.scenario,
      value:
        demoScenario === 'serviceError'
          ? `${selectedScenario.label} / ${selectedServiceErrorLabel}`
          : selectedScenario.label,
    },
    {
      label: copy.requestLog.labels.phase,
      value: copy.phaseLabels[phase],
    },
    {
      label: copy.requestLog.labels.statusCode,
      value:
        error?.statusCode ?? (phase === 'success' || phase === 'empty' ? 200 : '-'),
    },
    {
      label: copy.requestLog.labels.errorCode,
      value: error?.code ?? copy.requestLog.notApplicable,
    },
    {
      label: copy.requestLog.labels.retryable,
      value: error
        ? error.retryable
          ? copy.requestLog.retryableYes
          : copy.requestLog.retryableNo
        : copy.requestLog.notApplicable,
    },
    {
      label: copy.requestLog.labels.message,
      value: requestLogMessage,
      wide: true,
    },
    {
      label: copy.requestLog.labels.recovery,
      value: requestLogRecovery,
      wide: true,
    },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDialogPlaceId(null);
    setDemoScenario('live');
    runSearch(tourismKeyword, { demoScenario: 'live' });
  };

  const handleDemoScenarioChange = (scenario: ApiDemoScenarioId) => {
    setDialogPlaceId(null);
    setDemoScenario(scenario);

    if (scenario === 'empty') {
      setTourismKeyword(copy.failureDemo.emptyKeyword);
      runSearch(copy.failureDemo.emptyKeyword, { demoScenario: 'empty' });
      return;
    }

    const nextKeyword = tourismKeyword.trim() || '서울';

    if (!tourismKeyword.trim() && scenario !== 'live') {
      setTourismKeyword(nextKeyword);
    }

    runSearch(nextKeyword, {
      demoScenario: scenario,
      serviceError: selectedServiceError,
    });
  };

  const handleServiceErrorCodeChange = (
    nextServiceErrorId: string,
  ) => {
    setServiceErrorId(nextServiceErrorId);
    const nextServiceError =
      serviceErrorOptions.find((option) => option.id === nextServiceErrorId) ??
      fallbackServiceError;

    if (demoScenario === 'serviceError') {
      const nextKeyword = tourismKeyword.trim() || '서울';

      if (!tourismKeyword.trim()) {
        setTourismKeyword(nextKeyword);
      }

      runSearch(nextKeyword, {
        demoScenario: 'serviceError',
        serviceError: nextServiceError,
      });
    }
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

          <fieldset className="api-playground__scenario">
            <legend>{copy.failureDemo.label}</legend>
            <p>{copy.failureDemo.description}</p>
            <div className="api-playground__scenario-options">
              {apiDemoScenarioIds.map((scenarioId) => {
                const scenario = copy.failureDemo.options[scenarioId];

                return (
                  <button
                    type="button"
                    className={[
                      'api-playground__scenario-card',
                      demoScenario === scenarioId
                        ? 'api-playground__scenario-card--active'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    key={scenarioId}
                    aria-pressed={demoScenario === scenarioId}
                    onClick={() => handleDemoScenarioChange(scenarioId)}
                  >
                    <span className="api-playground__scenario-card-header">
                      <strong>{scenario.label}</strong>
                      {scenario.tooltip && (
                        <ApiScenarioInfoTooltip
                          label={scenario.label}
                          tooltip={scenario.tooltip}
                        />
                      )}
                    </span>
                    <span>{scenario.description}</span>
                  </button>
                );
              })}
            </div>
            {demoScenario === 'serviceError' && (
              <div className="api-playground__service-error-panel">
                <label className="api-playground__service-error-select">
                  <span>{copy.failureDemo.serviceErrorCodeLabel}</span>
                  <select
                    value={serviceErrorId}
                    onChange={(event) =>
                      handleServiceErrorCodeChange(event.target.value)}
                  >
                    {serviceErrorOptions.map((option) => (
                      <option value={option.id} key={option.id}>
                        {`${option.source === 'provider' ? '제공기관' : '공통'} ${option.code} · ${option.description}`}
                      </option>
                    ))}
                  </select>
                  <small>
                    {`${selectedServiceError.message} · ${selectedServiceError.description}`}
                  </small>
                </label>
                <TogglePanel
                  className="api-playground__unavailable-errors"
                  buttonClassName="api-playground__error-list-trigger"
                  panelClassName="api-playground__error-list-panel"
                  label={copy.failureDemo.unavailableErrorListLabel}
                  title={copy.failureDemo.unavailableErrorTitle}
                  description={copy.failureDemo.unavailableErrorDescription}
                >
                  <div className="api-playground__error-list">
                    {unavailableServiceErrorOptions.map((option) => (
                      <span key={option.id}>
                        {`${option.source === 'provider' ? '제공기관' : '공통'} ${option.code} · ${option.description}`}
                      </span>
                    ))}
                  </div>
                </TogglePanel>
              </div>
            )}
          </fieldset>

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
                <div className="api-playground__error-recovery">
                  <span>{copy.requestLog.labels.recovery}</span>
                  <strong>{errorRecovery}</strong>
                </div>
                <div className="api-playground__state-actions">
                  <button
                    type="button"
                    disabled={!canRetrySearch}
                    onClick={() =>
                      runSearch(scenarioKeyword, {
                        demoScenario,
                        serviceError: selectedServiceError,
                      })}
                  >
                    {copy.failureDemo.retryLabel}
                  </button>
                  {demoScenario !== 'live' && (
                    <button
                      type="button"
                      className="api-playground__state-action--secondary"
                      onClick={() => handleDemoScenarioChange('live')}
                    >
                      {copy.failureDemo.liveModeLabel}
                    </button>
                  )}
                </div>
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

        <Card
          title={copy.requestLog.title}
          description={copy.requestLog.description}
        >
          <dl className="api-playground__request-log" aria-live="polite">
            {requestLogRows.map((row) => (
              <div
                key={row.label}
                className={
                  row.wide ? 'api-playground__request-log-item--wide' : undefined
                }
              >
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
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
