import type { InfiniteTableCopy } from '../../i18n/dictionary';
import { useInfiniteMockRows } from '../../hooks/useInfiniteMockRows';

interface InfiniteRenderTableProps {
  copy: InfiniteTableCopy;
}

export const InfiniteRenderTable = ({ copy }: InfiniteRenderTableProps) => {
  const {
    rows,
    total,
    isInitialLoading,
    isLoadingMore,
    hasNextPage,
    viewportRef,
    sentinelRef,
  } = useInfiniteMockRows();

  return (
    <div className="infinite-table" aria-label={copy.ariaLabel}>
      <div className="infinite-table__summary" aria-live="polite">
        {isInitialLoading ? copy.loadingLabel : copy.rowCountLabel(rows.length, total)}
      </div>
      <div ref={viewportRef} className="table-scroll infinite-table__viewport">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{copy.headers.screen}</th>
              <th scope="col">{copy.headers.module}</th>
              <th scope="col">{copy.headers.status}</th>
              <th scope="col">{copy.headers.requestCount}</th>
              <th scope="col">{copy.headers.loadedAt}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.screen}</strong>
                  <small>{row.id}</small>
                </td>
                <td>{row.module}</td>
                <td>
                  <span className={`status status--${row.status.toLowerCase()}`}>
                    {copy.statusLabels[row.status]}
                  </span>
                </td>
                <td>{`${row.requestCount}${copy.requestCountUnitLabel}`}</td>
                <td>{row.loadedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={sentinelRef} className="infinite-table__sentinel" aria-hidden="true" />
        {isLoadingMore && (
          <div className="infinite-table__loader" aria-hidden="true">
            <span className="infinite-table__spinner" />
          </div>
        )}
      </div>
      {!isInitialLoading && rows.length === 0 && (
        <p className="infinite-table__state">{copy.emptyLabel}</p>
      )}
      {isLoadingMore && (
        <p className="infinite-table__state" aria-live="polite">
          {copy.loadingMoreLabel}
        </p>
      )}
      {!hasNextPage && rows.length > 0 && (
        <p className="infinite-table__state">{copy.endLabel}</p>
      )}
    </div>
  );
};
