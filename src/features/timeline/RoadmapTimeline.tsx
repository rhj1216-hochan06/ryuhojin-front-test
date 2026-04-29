import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react';
import Timeline, {
  DateHeader,
  SidebarHeader,
  TimelineHeaders,
  TimelineMarkers,
  TodayMarker,
  type ReactCalendarGroupRendererProps,
  type ReactCalendarItemRendererProps,
  type TimelineGroup,
  type TimelineItem,
  type TimelineKeys,
} from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import 'moment/locale/ko';
import styled from 'styled-components';
import type { RoadmapGroup, RoadmapItem, RoadmapStatus } from '../../types/dashboard';
import type { TimelineCopy } from '../../i18n/dictionary';

interface RoadmapTimelineProps {
  groups: RoadmapGroup[];
  items: RoadmapItem[];
  copy: TimelineCopy;
}

interface CalendarItemFields {
  progress: number;
  status: RoadmapStatus;
}

interface CalendarGroupFields {
  owner: string;
}

type CalendarItem = TimelineItem<CalendarItemFields, number>;
type CalendarGroup = TimelineGroup<CalendarGroupFields>;
type EditableRoadmapItem = RoadmapItem & { isVisible: boolean };

const dayMs = 24 * 60 * 60 * 1000;
const minZoom = dayMs;
const maxZoom = 365 * dayMs;

const statusColor: Record<RoadmapStatus, string> = {
  done: '#0f766e',
  active: '#2563eb',
  planned: '#b45309',
};

const timelineKeys: TimelineKeys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'title',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start_time',
  itemTimeEndKey: 'end_time',
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const toDateInputValue = (date: string | number) => moment(date).format('YYYY-MM-DD');

const normalizeItems = (items: RoadmapItem[]): EditableRoadmapItem[] =>
  items.map((item) => ({
    ...item,
    isVisible: item.isVisible ?? true,
  }));

const buildInitialRange = (items: RoadmapItem[]) => {
  if (items.length === 0) {
    return {
      start: moment().startOf('month').valueOf(),
      end: moment().endOf('month').valueOf(),
    };
  }

  const starts = items.map((item) => moment(item.startDate));
  const ends = items.map((item) => moment(item.endDate));

  return {
    start: moment.min(starts).subtract(2, 'days').startOf('day').valueOf(),
    end: moment.max(ends).add(3, 'days').endOf('day').valueOf(),
  };
};

const TimelineWorkbench = styled.div`
  display: grid;
  grid-template-columns: minmax(270px, 330px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const EditorPanel = styled.aside`
  display: grid;
  max-height: 620px;
  min-width: 0;
  overflow: auto;
  border: 1px solid #d7dee6;
  border-radius: 8px;
  background: #ffffff;

  .timeline-editor__header {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 14px;
    border-bottom: 1px solid #d7dee6;
    background: #f7f9fb;
  }

  .timeline-editor__header strong,
  .timeline-editor__header span {
    display: block;
  }

  .timeline-editor__header span {
    margin-top: 4px;
    color: #64717f;
    font-size: 0.82rem;
    line-height: 1.45;
  }

  .timeline-editor__list {
    display: grid;
    gap: 10px;
    padding: 12px;
  }

  .timeline-editor__item {
    display: grid;
    gap: 10px;
    padding: 12px;
    border: 1px solid #d7dee6;
    border-left: 4px solid #0f766e;
    border-radius: 8px;
    background: #ffffff;
  }

  .timeline-editor__item.is-active {
    border-color: #2563eb;
    border-left-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .timeline-editor__top {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }

  .timeline-editor__visible {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    color: #41515d;
    font-size: 0.8rem;
    font-weight: 800;
  }

  .timeline-editor__fields {
    display: grid;
    gap: 8px;
  }

  label {
    display: grid;
    gap: 4px;
    color: #41515d;
    font-size: 0.76rem;
    font-weight: 900;
  }

  input,
  select {
    width: 100%;
    min-width: 0;
    min-height: 36px;
    border: 1px solid #d7dee6;
    border-radius: 8px;
    background: #ffffff;
    color: #27323a;
    padding: 7px 9px;
  }

  .timeline-editor__inline {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  @media (max-width: 520px) {
    .timeline-editor__inline {
      grid-template-columns: 1fr;
    }
  }
`;

const TimelineShell = styled.div`
  min-width: 0;
  overflow: hidden;
  border: 1px solid #d7dee6;
  border-radius: 8px;
  background: #ffffff;

  .timeline-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid #d7dee6;
    background: #f7f9fb;
  }

  .timeline-toolbar__summary {
    color: #41515d;
    font-size: 0.86rem;
    font-weight: 800;
  }

  .timeline-toolbar__actions {
    display: inline-flex;
    gap: 6px;
  }

  .timeline-toolbar button {
    min-height: 34px;
    border: 1px solid #d7dee6;
    border-radius: 8px;
    background: #ffffff;
    color: #27323a;
    padding: 6px 10px;
    font-size: 0.82rem;
    font-weight: 800;
  }

  .timeline-toolbar button:hover {
    border-color: #0f766e;
    color: #0f766e;
  }

  .timeline-canvas {
    min-width: 0;
    overflow-x: auto;
  }

  .react-calendar-timeline {
    min-width: 760px;
    border: 0;
    font-family: inherit;
  }

  .rct-header-root {
    border-bottom: 1px solid #d7dee6;
    background: #f7f9fb;
  }

  .rct-sidebar {
    border-right: 1px solid #d7dee6;
    background: #ffffff;
  }

  .rct-sidebar-row {
    color: #27323a;
    font-weight: 800;
  }

  .rct-dateHeader {
    border-left: 1px solid #e4eaf0;
    color: #64717f;
    font-size: 0.78rem;
    font-weight: 800;
  }

  .rct-item {
    border-radius: 8px;
    overflow: visible !important;
  }

  .timeline-group-label {
    display: grid;
    gap: 2px;
    padding: 6px 10px;
    line-height: 1.2;
  }

  .timeline-group-label span {
    color: #64717f;
    font-size: 0.72rem;
  }

  .timeline-item {
    position: relative;
    display: block;
    height: 100%;
    overflow: visible;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 0;
  }

  .timeline-item__content {
    position: absolute;
    top: 50%;
    left: 8px;
    z-index: 2;
    display: inline-flex;
    gap: 6px;
    align-items: center;
    width: max-content;
    max-width: 260px;
    color: #172026;
    pointer-events: none;
    transform: translateY(-50%);
  }

  .timeline-item__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #172026;
    font-size: 0.78rem;
    font-weight: 900;
  }

  .timeline-item__progress {
    color: #27323a;
    font-size: 0.72rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .timeline-item__resize {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 4;
    width: 10px;
    height: 100%;
    border-radius: 0;
    background: transparent;
    cursor: ew-resize;
  }

  .timeline-item__resize.rct-item-handler-left {
    left: -5px !important;
  }

  .timeline-item__resize.rct-item-handler-right {
    right: -5px !important;
  }

  .timeline-item__resize:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.82);
    outline-offset: -2px;
  }

  .timeline-today-marker {
    z-index: 60 !important;
    overflow: visible;
    background: transparent !important;
    background-color: transparent !important;
    pointer-events: none;
  }

  .timeline-today-marker__line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -1px;
    width: 2px;
    background: #be123c;
    box-shadow: 0 0 0 1px rgba(190, 18, 60, 0.16);
  }

  .timeline-today-marker__label {
    position: absolute;
    top: 7px;
    left: 0;
    display: inline-flex;
    align-items: center;
    min-height: 22px;
    border-radius: 999px;
    background: #be123c;
    color: #ffffff;
    padding: 3px 8px;
    font-size: 0.72rem;
    font-weight: 900;
    line-height: 1;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(190, 18, 60, 0.24);
    transform: translateX(-50%);
  }
`;

export const RoadmapTimeline = ({ groups, items, copy }: RoadmapTimelineProps) => {
  moment.locale(copy.momentLocale);

  const initialRange = useMemo(() => buildInitialRange(items), [items]);
  const [editableItems, setEditableItems] = useState<EditableRoadmapItem[]>(
    () => normalizeItems(items),
  );
  const [activeItemId, setActiveItemId] = useState<number | null>(items[0]?.id ?? null);
  const [visibleTime, setVisibleTime] = useState(initialRange);

  useEffect(() => {
    setEditableItems(normalizeItems(items));
    setActiveItemId(items[0]?.id ?? null);
  }, [items]);

  useEffect(() => {
    setVisibleTime(initialRange);
  }, [initialRange]);

  const calendarGroups: CalendarGroup[] = useMemo(
    () =>
      groups.map((group) => ({
        id: group.id,
        title: group.title,
        rightTitle: group.owner,
        owner: group.owner,
      })),
    [groups],
  );

  const calendarItems: CalendarItem[] = useMemo(
    () =>
      editableItems
        .filter((item) => item.isVisible)
        .map((item) => ({
          id: item.id,
          group: item.group,
          title: item.title,
          start_time: moment(item.startDate).startOf('day').valueOf(),
          end_time: moment(item.endDate).endOf('day').valueOf(),
          canMove: true,
          canResize: 'both',
          canChangeGroup: true,
          progress: item.progress,
          status: item.status,
          itemProps: {
            'aria-label': `${item.title}, ${copy.statusLabels[item.status]}, ${item.progress}%`,
            title: `${item.title} (${item.progress}%)`,
          },
        })),
    [copy.statusLabels, editableItems],
  );

  const updateItem = useCallback((itemId: number, patch: Partial<EditableRoadmapItem>) => {
    setEditableItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    );
    setActiveItemId(itemId);
  }, []);

  const handleTimeChange = useCallback(
    (
      visibleTimeStart: number,
      visibleTimeEnd: number,
      updateScrollCanvas: (start: number, end: number) => void,
    ) => {
      const currentSpan = visibleTimeEnd - visibleTimeStart;
      const nextSpan = clamp(currentSpan, minZoom, maxZoom);
      const center = (visibleTimeStart + visibleTimeEnd) / 2;
      const nextStart = center - nextSpan / 2;
      const nextEnd = center + nextSpan / 2;

      setVisibleTime({ start: nextStart, end: nextEnd });
      updateScrollCanvas(nextStart, nextEnd);
    },
    [],
  );

  const zoomBy = useCallback((scale: number) => {
    setVisibleTime((current) => {
      const currentSpan = current.end - current.start;
      const nextSpan = clamp(currentSpan * scale, minZoom, maxZoom);
      const center = (current.start + current.end) / 2;

      return {
        start: center - nextSpan / 2,
        end: center + nextSpan / 2,
      };
    });
  }, []);

  const handleItemMove = useCallback(
    (itemId: number | string, dragTime: number, newGroupOrder: number) => {
      const nextGroup = calendarGroups[newGroupOrder];

      if (!nextGroup || typeof itemId !== 'number') {
        return;
      }

      setEditableItems((current) =>
        current.map((item) => {
          if (item.id !== itemId) {
            return item;
          }

          const duration = moment(item.endDate).endOf('day').valueOf() -
            moment(item.startDate).startOf('day').valueOf();

          return {
            ...item,
            group: Number(nextGroup.id),
            startDate: toDateInputValue(dragTime),
            endDate: toDateInputValue(dragTime + duration),
          };
        }),
      );
      setActiveItemId(itemId);
    },
    [calendarGroups],
  );

  const handleItemResize = useCallback(
    (itemId: number | string, time: number, edge: 'left' | 'right') => {
      if (typeof itemId !== 'number') {
        return;
      }

      setEditableItems((current) =>
        current.map((item) =>
          item.id === itemId
            ? {
                ...item,
                startDate: edge === 'left' ? toDateInputValue(time) : item.startDate,
                endDate: edge === 'right' ? toDateInputValue(time) : item.endDate,
              }
            : item,
        ),
      );
      setActiveItemId(itemId);
    },
    [],
  );

  const itemRenderer = useCallback(
    ({
      item,
      itemContext,
      getItemProps,
      getResizeProps,
    }: ReactCalendarItemRendererProps<CalendarItem>) => {
      const resizeProps = getResizeProps({
        leftClassName: 'timeline-item__resize',
        rightClassName: 'timeline-item__resize',
      });
      const itemStyle: CSSProperties = {
        background: itemContext.selected ? '#dfe7ef' : statusColor[item.status],
        borderColor: itemContext.resizing ? '#be123c' : statusColor[item.status],
        color: '#172026',
      };

      return (
        <div {...getItemProps({ className: 'timeline-item', style: itemStyle })}>
          {itemContext.useResizeHandle && resizeProps.left ? (
            <div {...resizeProps.left} />
          ) : (
            <span aria-hidden="true" />
          )}
          <span className="timeline-item__content">
            <span className="timeline-item__title">{itemContext.title}</span>
            <span className="timeline-item__progress">{item.progress}%</span>
          </span>
          {itemContext.useResizeHandle && resizeProps.right ? (
            <div {...resizeProps.right} />
          ) : null}
        </div>
      );
    },
    [],
  );

  const groupRenderer = useCallback(
    ({ group }: ReactCalendarGroupRendererProps<CalendarGroup>) => (
      <div className="timeline-group-label">
        <strong>{group.title}</strong>
        <span>{group.owner}</span>
      </div>
    ),
    [],
  );

  const visibleCount = editableItems.filter((item) => item.isVisible).length;
  const currentVisibleSpan = visibleTime.end - visibleTime.start;
  const isMaxZoomedIn = currentVisibleSpan <= minZoom * 1.02;
  const markerLabel = isMaxZoomedIn ? copy.markerLabels.now : copy.markerLabels.today;

  return (
    <TimelineWorkbench>
      <EditorPanel aria-label={copy.editorLabel}>
        <div className="timeline-editor__header">
          <strong>{copy.editorTitle}</strong>
          <span>{copy.editorDescription}</span>
        </div>
        <div className="timeline-editor__list">
          {editableItems.map((item) => (
            <article
              key={item.id}
              className={[
                'timeline-editor__item',
                activeItemId === item.id ? 'is-active' : undefined,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="timeline-editor__top">
                <strong>{item.id.toString().padStart(2, '0')}</strong>
                <label className="timeline-editor__visible">
                  <input
                    type="checkbox"
                    checked={item.isVisible}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      updateItem(item.id, { isVisible: event.target.checked })
                    }
                  />
                  {copy.visibleLabel}
                </label>
              </div>
              <div className="timeline-editor__fields">
                <label>
                  {copy.titleLabel}
                  <input
                    value={item.title}
                    onFocus={() => setActiveItemId(item.id)}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      updateItem(item.id, { title: event.target.value })
                    }
                  />
                </label>
                <div className="timeline-editor__inline">
                  <label>
                    {copy.groupLabel}
                    <select
                      value={item.group}
                      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                        updateItem(item.id, { group: Number(event.target.value) })
                      }
                    >
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {copy.statusLabel}
                    <select
                      value={item.status}
                      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                        updateItem(item.id, {
                          status: event.target.value as RoadmapStatus,
                        })
                      }
                    >
                      {Object.entries(copy.statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="timeline-editor__inline">
                  <label>
                    {copy.startLabel}
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        updateItem(item.id, { startDate: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    {copy.endLabel}
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        updateItem(item.id, { endDate: event.target.value })
                      }
                    />
                  </label>
                </div>
                <label>
                  {copy.progressLabel}
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={item.progress}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      updateItem(item.id, {
                        progress: clamp(Number(event.target.value), 0, 100),
                      })
                    }
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </EditorPanel>
      <TimelineShell aria-label={copy.shellLabel}>
        <div className="timeline-toolbar">
          <span className="timeline-toolbar__summary">
            {copy.summary(visibleCount, groups.length)}
          </span>
          <div className="timeline-toolbar__actions" aria-label={copy.zoomControlsLabel}>
            <button type="button" aria-label={copy.zoomInLabel} onClick={() => zoomBy(0.55)}>
              {copy.zoomInLabel}
            </button>
            <button type="button" aria-label={copy.zoomOutLabel} onClick={() => zoomBy(1.65)}>
              {copy.zoomOutLabel}
            </button>
            <button
              type="button"
              aria-label={copy.resetLabel}
              onClick={() => setVisibleTime(initialRange)}
            >
              {copy.resetLabel}
            </button>
          </div>
        </div>
        <div className="timeline-canvas">
          <Timeline<CalendarItem, CalendarGroup>
            groups={calendarGroups}
            items={calendarItems}
            keys={timelineKeys}
            visibleTimeStart={visibleTime.start}
            visibleTimeEnd={visibleTime.end}
            onTimeChange={handleTimeChange}
            onItemMove={handleItemMove}
            onItemResize={handleItemResize}
            onItemClick={(itemId) =>
              setActiveItemId(typeof itemId === 'number' ? itemId : Number(itemId))
            }
            canMove
            canResize="both"
            canChangeGroup
            useResizeHandle
            itemTouchSendsClick={false}
            itemHeightRatio={0.75}
            lineHeight={48}
            minZoom={minZoom}
            maxZoom={maxZoom}
            dragSnap={dayMs}
            sidebarWidth={170}
            stackItems
            itemRenderer={itemRenderer}
            groupRenderer={groupRenderer}
          >
            <TimelineHeaders>
              <SidebarHeader<{ label: string }> headerData={{ label: copy.sidebarLabel }}>
                {({ getRootProps, data }) => (
                  <div {...getRootProps()}>
                    <strong>{data.label}</strong>
                  </div>
                )}
              </SidebarHeader>
              <DateHeader unit="primaryHeader" />
              <DateHeader />
            </TimelineHeaders>
            <TimelineMarkers>
              <TodayMarker key={markerLabel} date={Date.now()} interval={1000}>
                {({ styles }) => (
                  <div
                    className="timeline-today-marker"
                    style={{ ...styles, width: 0, backgroundColor: 'transparent' }}
                  >
                    <span className="timeline-today-marker__line" aria-hidden="true" />
                    <span className="timeline-today-marker__label">{markerLabel}</span>
                  </div>
                )}
              </TodayMarker>
            </TimelineMarkers>
          </Timeline>
        </div>
      </TimelineShell>
    </TimelineWorkbench>
  );
};
