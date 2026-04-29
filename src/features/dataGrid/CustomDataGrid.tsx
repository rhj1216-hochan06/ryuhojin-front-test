import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type {
  PortfolioGridImpact,
  PortfolioGridRow,
  PortfolioGridStatus,
} from '../../types/dashboard';
import type { CustomGridCopy } from '../../i18n/dictionary';

interface CustomDataGridProps {
  rows: PortfolioGridRow[];
  copy: CustomGridCopy;
}

type SortKey = 'capability' | 'category' | 'coverage' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface NewGridRowDraft {
  capability: string;
  category: string;
  owner: string;
  status: PortfolioGridStatus;
  coverage: number;
}

interface NewGridChildDraft {
  name: string;
  owner: string;
  status: PortfolioGridStatus;
  impact: PortfolioGridImpact;
}

const getSearchText = (row: PortfolioGridRow) =>
  [
    row.capability,
    row.category,
    row.owner,
    row.status,
    row.children.map((child) => `${child.name} ${child.notes}`).join(' '),
  ]
    .join(' ')
    .toLowerCase();

const getRowIds = (row: PortfolioGridRow) => [
  row.id,
  ...row.children.map((child) => child.id),
];

const getChildIds = (row: PortfolioGridRow) =>
  row.children.map((child) => child.id);

const createNewRowDraft = (rows: PortfolioGridRow[]): NewGridRowDraft => ({
  capability: '',
  category: rows[0]?.category ?? '',
  owner: '',
  status: 'Review',
  coverage: 0,
});

const createNewChildDraft = (row: PortfolioGridRow): NewGridChildDraft => ({
  name: '',
  owner: row.owner,
  status: 'Review',
  impact: 'Medium',
});

const getTodayLabel = () => new Date().toISOString().slice(0, 10);

const compareRows = (
  first: PortfolioGridRow,
  second: PortfolioGridRow,
  key: SortKey,
  direction: SortDirection,
) => {
  const modifier = direction === 'asc' ? 1 : -1;

  if (key === 'coverage') {
    return (first.coverage - second.coverage) * modifier;
  }

  return String(first[key]).localeCompare(String(second[key])) * modifier;
};

export const CustomDataGrid = ({ rows, copy }: CustomDataGridProps) => {
  const [committedRows, setCommittedRows] = useState<PortfolioGridRow[]>(rows);
  const [draftRows, setDraftRows] = useState<PortfolioGridRow[]>(rows);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('capability');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    () => new Set(rows.map((row) => row.id)),
  );
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectionSnapshot, setSelectionSnapshot] = useState<Set<string>>(new Set());
  const [newRow, setNewRow] = useState<NewGridRowDraft>(() =>
    createNewRowDraft(rows),
  );
  const [newChildRows, setNewChildRows] = useState<Record<string, NewGridChildDraft>>(
    {},
  );

  const activeRows = isEditMode ? draftRows : committedRows;

  useEffect(() => {
    setCommittedRows(rows);
    setDraftRows(rows);
    setExpandedRows(new Set(rows.map((row) => row.id)));
    setSelectedRows(new Set());
    setSelectionSnapshot(new Set());
    setNewRow(createNewRowDraft(rows));
    setNewChildRows({});
  }, [rows]);

  const categories = useMemo(
    () => Array.from(new Set(activeRows.map((row) => row.category))),
    [activeRows],
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return activeRows
      .filter((row) => categoryFilter === 'all' || row.category === categoryFilter)
      .filter((row) => !normalizedSearch || getSearchText(row).includes(normalizedSearch))
      .sort((first, second) => compareRows(first, second, sortKey, sortDirection));
  }, [activeRows, categoryFilter, searchTerm, sortDirection, sortKey]);

  const selectedCount = selectedRows.size;
  const filteredRowIds = filteredRows.flatMap((row) => getRowIds(row));
  const isAllFilteredSelected =
    filteredRowIds.length > 0 && filteredRowIds.every((id) => selectedRows.has(id));
  const isSomeFilteredSelected = filteredRowIds.some((id) => selectedRows.has(id));

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection('asc');
      return;
    }

    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
  };

  const toggleExpanded = (rowId: string) => {
    setExpandedRows((current) => {
      const next = new Set(current);
      next.has(rowId) ? next.delete(rowId) : next.add(rowId);
      return next;
    });
  };

  const toggleAllSelection = () => {
    setSelectedRows((current) => {
      const next = new Set(current);

      if (isAllFilteredSelected) {
        filteredRowIds.forEach((id) => next.delete(id));
      } else {
        filteredRowIds.forEach((id) => next.add(id));
      }

      return next;
    });
  };

  const toggleRowSelection = (row: PortfolioGridRow) => {
    const ids = getRowIds(row);

    setSelectedRows((current) => {
      const next = new Set(current);
      const isSelected = ids.every((id) => next.has(id));

      if (isSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }

      return next;
    });
  };

  const toggleChildSelection = (row: PortfolioGridRow, childId: string) => {
    const childIds = getChildIds(row);

    setSelectedRows((current) => {
      const next = new Set(current);

      next.has(childId) ? next.delete(childId) : next.add(childId);

      if (childIds.every((id) => next.has(id))) {
        next.add(row.id);
      } else {
        next.delete(row.id);
      }

      return next;
    });
  };

  const addDraftRow = () => {
    const capability = newRow.capability.trim();
    const category = newRow.category.trim();
    const owner = newRow.owner.trim();

    if (!capability || !category || !owner) {
      return;
    }

    const id = `custom-${Date.now()}`;
    const nextRow: PortfolioGridRow = {
      id,
      capability,
      category,
      owner,
      status: newRow.status,
      coverage: Math.min(Math.max(newRow.coverage, 0), 100),
      updatedAt: getTodayLabel(),
      children: [],
    };

    setDraftRows((current) => [nextRow, ...current]);
    setExpandedRows((current) => new Set(current).add(id));
    setNewRow(createNewRowDraft([nextRow, ...draftRows]));
  };

  const updateNewChildRow = (
    row: PortfolioGridRow,
    updates: Partial<NewGridChildDraft>,
  ) => {
    setNewChildRows((current) => ({
      ...current,
      [row.id]: {
        ...(current[row.id] ?? createNewChildDraft(row)),
        ...updates,
      },
    }));
  };

  const addDraftChild = (row: PortfolioGridRow) => {
    const draft = newChildRows[row.id] ?? createNewChildDraft(row);
    const name = draft.name.trim();
    const owner = draft.owner.trim();

    if (!name || !owner) {
      return;
    }

    const childId = `${row.id}-child-${Date.now()}`;

    setDraftRows((current) =>
      current.map((currentRow) =>
        currentRow.id === row.id
          ? {
              ...currentRow,
              children: [
                {
                  id: childId,
                  name,
                  owner,
                  status: draft.status,
                  impact: draft.impact,
                  updatedAt: getTodayLabel(),
                  notes: copy.addedChildNote,
                },
                ...currentRow.children,
              ],
            }
          : currentRow,
      ),
    );
    setSelectedRows((current) => {
      if (!current.has(row.id)) {
        return current;
      }

      const next = new Set(current);
      next.add(childId);
      return next;
    });
    setNewChildRows((current) => ({
      ...current,
      [row.id]: createNewChildDraft(row),
    }));
  };

  const deleteSelectedDraftRows = () => {
    if (selectedRows.size === 0) {
      return;
    }

    setDraftRows((current) =>
      current
        .filter((row) => !selectedRows.has(row.id))
        .map((row) => ({
          ...row,
          children: row.children.filter((child) => !selectedRows.has(child.id)),
        })),
    );
    setSelectedRows(new Set());
  };

  const enterEditMode = () => {
    setDraftRows(committedRows);
    setSelectionSnapshot(new Set(selectedRows));
    setNewRow(createNewRowDraft(committedRows));
    setNewChildRows({});
    setIsEditMode(true);
  };

  const cancelEditMode = () => {
    setDraftRows(committedRows);
    setSelectedRows(new Set(selectionSnapshot));
    setNewChildRows({});
    setIsEditMode(false);
  };

  const saveEditMode = () => {
    setCommittedRows(draftRows);
    setIsEditMode(false);
  };

  const isAddRowDisabled =
    !newRow.capability.trim() || !newRow.category.trim() || !newRow.owner.trim();

  const renderSortLabel = (key: SortKey, label: string) =>
    sortKey === key ? `${label} ${sortDirection === 'asc' ? '↑' : '↓'}` : label;

  return (
    <div className="custom-grid" aria-label={copy.ariaLabel}>
      <div className="custom-grid__toolbar">
        <label>
          {copy.searchLabel}
          <input
            value={searchTerm}
            placeholder={copy.searchPlaceholder}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
          />
        </label>
        <label>
          {copy.categoryLabel}
          <select
            value={categoryFilter}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setCategoryFilter(event.target.value)
            }
          >
            <option value="all">{copy.allCategoriesLabel}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <div className="custom-grid__actions">
          {isEditMode && <span aria-live="polite">{copy.selectedLabel(selectedCount)}</span>}
          {!isEditMode ? (
            <button
              type="button"
              aria-pressed={isEditMode}
              onClick={enterEditMode}
            >
              {copy.editModeLabel}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={deleteSelectedDraftRows}
                disabled={selectedCount === 0}
              >
                {copy.deleteSelectedLabel}
              </button>
              <button type="button" onClick={cancelEditMode}>
                {copy.cancelLabel}
              </button>
              <button type="button" className="is-primary" onClick={saveEditMode}>
                {copy.saveLabel}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setExpandedRows(new Set(filteredRows.map((row) => row.id)))}
          >
            {copy.expandLabel}
          </button>
          <button type="button" onClick={() => setExpandedRows(new Set())}>
            {copy.collapseLabel}
          </button>
        </div>
      </div>
      {isEditMode && (
        <p className="custom-grid__mode-note">
          {copy.editModeNote}
        </p>
      )}
      <div className="custom-grid__board">
        <div
          className={[
            'custom-grid__head',
            isEditMode ? 'custom-grid__head--edit' : undefined,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {isEditMode && (
            <label className="custom-grid__select-all">
              <input
                type="checkbox"
                aria-label={copy.selectAllLabel}
                checked={isAllFilteredSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate =
                      isSomeFilteredSelected && !isAllFilteredSelected;
                  }
                }}
                onChange={toggleAllSelection}
              />
            </label>
          )}
          <span>
            <button type="button" onClick={() => toggleSort('capability')}>
              {renderSortLabel('capability', copy.headers.capability)}
            </button>
          </span>
          <span>
            <button type="button" onClick={() => toggleSort('category')}>
              {renderSortLabel('category', copy.headers.category)}
            </button>
          </span>
          <span>{copy.headers.owner}</span>
          <span>{copy.headers.status}</span>
          <span>
            <button type="button" onClick={() => toggleSort('coverage')}>
              {renderSortLabel('coverage', copy.headers.coverage)}
            </button>
          </span>
          <span>
            <button type="button" onClick={() => toggleSort('updatedAt')}>
              {renderSortLabel('updatedAt', copy.headers.updated)}
            </button>
          </span>
        </div>
        <div className="custom-grid__rows">
          {isEditMode && (
            <article className="custom-grid__row-card custom-grid__row-card--edit custom-grid__row-card--new">
              <div className="custom-grid__row-main custom-grid__row-main--new">
                <span className="custom-grid__new-label">{copy.newRowLabel}</span>
                <label className="custom-grid__inline-field">
                  <span>{copy.headers.capability}</span>
                  <input
                    value={newRow.capability}
                    placeholder={copy.newRowPlaceholder.capability}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setNewRow((current) => ({
                        ...current,
                        capability: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="custom-grid__inline-field">
                  <span>{copy.headers.category}</span>
                  <input
                    value={newRow.category}
                    placeholder={copy.newRowPlaceholder.category}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setNewRow((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="custom-grid__inline-field">
                  <span>{copy.headers.owner}</span>
                  <input
                    value={newRow.owner}
                    placeholder={copy.newRowPlaceholder.owner}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setNewRow((current) => ({
                        ...current,
                        owner: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="custom-grid__inline-field">
                  <span>{copy.headers.status}</span>
                  <select
                    value={newRow.status}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                      setNewRow((current) => ({
                        ...current,
                        status: event.target.value as PortfolioGridStatus,
                      }))
                    }
                  >
                    {Object.keys(copy.statusLabels).map((status) => (
                      <option key={status} value={status}>
                        {copy.statusLabels[status as PortfolioGridStatus]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="custom-grid__inline-field">
                  <span>{copy.headers.coverage}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newRow.coverage}
                    placeholder={copy.newRowPlaceholder.coverage}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setNewRow((current) => ({
                        ...current,
                        coverage: Number(event.target.value),
                      }))
                    }
                  />
                </label>
                <button
                  type="button"
                  className="custom-grid__add-row"
                  disabled={isAddRowDisabled}
                  onClick={addDraftRow}
                >
                  {copy.addRowLabel}
                </button>
              </div>
            </article>
          )}
          {filteredRows.map((row) => {
            const isExpanded = expandedRows.has(row.id);
            const rowIds = getRowIds(row);
            const isSelected = rowIds.every((id) => selectedRows.has(id));
            const selectedChildCount = row.children.filter((child) =>
              selectedRows.has(child.id),
            ).length;
            const isPartiallySelected =
              selectedChildCount > 0 && selectedChildCount < row.children.length;

            return (
              <article
                key={row.id}
                className={[
                  'custom-grid__row-card',
                  isEditMode ? 'custom-grid__row-card--edit' : undefined,
                  isSelected ? 'is-selected' : undefined,
                  isPartiallySelected ? 'is-partially-selected' : undefined,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="custom-grid__row-main">
                  {isEditMode && (
                    <label className="custom-grid__row-check">
                      <input
                        type="checkbox"
                        aria-label={copy.selectRowLabel(row.capability)}
                        checked={isSelected}
                        aria-checked={isPartiallySelected ? 'mixed' : isSelected}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = isPartiallySelected;
                          }
                        }}
                        onChange={() => toggleRowSelection(row)}
                      />
                    </label>
                  )}
                  <div className="custom-grid__cell custom-grid__cell--title">
                    <button
                      type="button"
                      className="custom-grid__caret"
                      aria-expanded={isExpanded}
                      aria-label={copy.toggleRowLabel(
                        isExpanded ? copy.collapseLabel : copy.expandLabel,
                        row.capability,
                      )}
                      onClick={() => toggleExpanded(row.id)}
                    >
                      <span className={isExpanded ? 'is-open' : undefined} />
                    </button>
                    <div>
                      <strong>{row.capability}</strong>
                      <small>{row.id}</small>
                    </div>
                  </div>
                  <div className="custom-grid__cell">{row.category}</div>
                  <div className="custom-grid__cell">{row.owner}</div>
                  <div className="custom-grid__cell">
                    <span className={`status status--${row.status.toLowerCase()}`}>
                      {copy.statusLabels[row.status]}
                    </span>
                  </div>
                  <div className="custom-grid__cell">{row.coverage}%</div>
                  <div className="custom-grid__cell">{row.updatedAt}</div>
                </div>
                {isExpanded && (
                  <div
                    className={[
                      'custom-grid__children',
                      isEditMode ? 'custom-grid__children--edit' : undefined,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {isEditMode && (
                      <div className="custom-grid__child-card custom-grid__child-card--edit custom-grid__child-card--new">
                        <span className="custom-grid__new-label">{copy.newChildLabel}</span>
                        <label className="custom-grid__inline-field">
                          <span>{copy.headers.capability}</span>
                          <input
                            value={
                              (newChildRows[row.id] ?? createNewChildDraft(row)).name
                            }
                            placeholder={copy.newChildPlaceholder.name}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              updateNewChildRow(row, { name: event.target.value })
                            }
                          />
                        </label>
                        <label className="custom-grid__inline-field">
                          <span>{copy.impactSuffix}</span>
                          <select
                            value={
                              (newChildRows[row.id] ?? createNewChildDraft(row)).impact
                            }
                            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                              updateNewChildRow(row, {
                                impact: event.target.value as PortfolioGridImpact,
                              })
                            }
                          >
                            {Object.keys(copy.impactLabels).map((impact) => (
                              <option key={impact} value={impact}>
                                {copy.impactLabels[impact as PortfolioGridImpact]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="custom-grid__inline-field">
                          <span>{copy.headers.owner}</span>
                          <input
                            value={
                              (newChildRows[row.id] ?? createNewChildDraft(row)).owner
                            }
                            placeholder={copy.newChildPlaceholder.owner}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              updateNewChildRow(row, { owner: event.target.value })
                            }
                          />
                        </label>
                        <label className="custom-grid__inline-field">
                          <span>{copy.headers.status}</span>
                          <select
                            value={
                              (newChildRows[row.id] ?? createNewChildDraft(row)).status
                            }
                            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                              updateNewChildRow(row, {
                                status: event.target.value as PortfolioGridStatus,
                              })
                            }
                          >
                            {Object.keys(copy.statusLabels).map((status) => (
                              <option key={status} value={status}>
                                {copy.statusLabels[status as PortfolioGridStatus]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="button"
                          className="custom-grid__add-child"
                          disabled={
                            !(newChildRows[row.id] ?? createNewChildDraft(row)).name.trim() ||
                            !(newChildRows[row.id] ?? createNewChildDraft(row)).owner.trim()
                          }
                          onClick={() => addDraftChild(row)}
                        >
                          {copy.addChildLabel}
                        </button>
                      </div>
                    )}
                    {row.children.map((child) => {
                      const isChildSelected = selectedRows.has(child.id);

                      return (
                        <div
                          key={child.id}
                          className={[
                            'custom-grid__child-card',
                            isEditMode ? 'custom-grid__child-card--edit' : undefined,
                            isChildSelected ? 'is-selected' : undefined,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {isEditMode && (
                            <label className="custom-grid__child-check">
                              <input
                                type="checkbox"
                                aria-label={copy.selectRowLabel(child.name)}
                                checked={isChildSelected}
                                onChange={() => toggleChildSelection(row, child.id)}
                              />
                            </label>
                          )}
                          <span>{child.name}</span>
                          <span>{`${copy.impactLabels[child.impact]} ${copy.impactSuffix}`}</span>
                          <span>{child.owner}</span>
                          <span className={`status status--${child.status.toLowerCase()}`}>
                            {copy.statusLabels[child.status]}
                          </span>
                          <span>{child.updatedAt}</span>
                          <small>{child.notes}</small>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
