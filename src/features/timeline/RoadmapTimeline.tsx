import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  type Unit,
} from 'react-calendar-timeline';
import moment, { type Moment } from 'moment';
import 'moment/locale/ko';
import styled from 'styled-components';
import type { RoadmapGroup, RoadmapItem, RoadmapStatus } from '../../types/dashboard';
import type { TimelineCopy } from '../../i18n/dictionary';
import {
  dayMs,
  getTimelineEndMs,
  getTimelineStartMs,
  halfHourMs,
  hourMs,
  toDateTimeInputValue,
} from './timelineDate';
import './Timeline.css';

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

interface AxisHeaderData {
  groupLabel: string;
  timeLabel: string;
  ariaLabel: string;
}

const minZoom = 6 * hourMs;
const maxZoom = 365 * dayMs;
const editorScrollGap = 12;
const sparseTimeLabelWidth = 24;
const compactTimeLabelWidth = 40;
const comfortableTimeLabelWidth = 56;
const sparseDayLabelWidth = 24;
const compactDayLabelWidth = 40;
const comfortableDayLabelWidth = 56;
const wideDayLabelSpan = 45 * dayMs;
const veryWideDayLabelSpan = 90 * dayMs;
const nowMarkerVisibleSpan = 3 * dayMs;

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

const formatNarrowDateLabel = (value: Moment) => value.format('D');
const formatHourLabel = (value: Moment, locale: string) =>
  locale === 'ko' ? `${value.format('H')}시` : value.format('H');
const formatMinuteLabel = (value: Moment, locale: string) => {
  if (locale === 'ko' && value.minute() === 0) {
    return formatHourLabel(value, locale);
  }

  return value.format('H:mm');
};

const buildAxisHeaderData = (copy: TimelineCopy): AxisHeaderData => {
  const [groupLabel, timeLabel] = copy.axisHeaderLabel
    .split('\\')
    .map((label) => label.trim());
  const fallbackTimeLabel = copy.momentLocale === 'ko' ? '시간' : 'Time';

  return {
    groupLabel: groupLabel || copy.sidebarLabel,
    timeLabel: timeLabel || fallbackTimeLabel,
    ariaLabel: `${groupLabel || copy.sidebarLabel} / ${timeLabel || fallbackTimeLabel}`,
  };
};

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

  const starts = items.map((item) => moment(getTimelineStartMs(item.startDate)));
  const ends = items.map((item) => moment(getTimelineEndMs(item.endDate)));

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
  scroll-padding: 88px 12px 12px;
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
    scroll-margin-top: 88px;
    padding: 12px;
    border: 1px solid #d7dee6;
    border-left: 4px solid #0f766e;
    border-radius: 8px;
    background: #ffffff;
    transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
  }

  .timeline-editor__item.is-active {
    border-color: #2563eb;
    border-left-color: #2563eb;
    background: rgba(37, 99, 235, 0.06);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .timeline-editor__top {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }

  .timeline-editor__item-id {
    color: #172026;
  }

  .timeline-editor__visible {
    display: inline-flex;
    flex: 0 0 auto;
    gap: 6px;
    align-items: center;
    color: #41515d;
    font-size: 0.8rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .timeline-editor__visible input[type='checkbox'] {
    flex: 0 0 auto;
    width: 16px;
    min-width: 16px;
    height: 16px;
    min-height: 16px;
    padding: 0;
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

  .timeline-editor__item:focus-within {
    outline: 2px solid rgba(37, 99, 235, 0.24);
    outline-offset: 2px;
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

export const RoadmapTimeline = ({ groups, items, copy }: RoadmapTimelineProps) => {
  const initialRange = useMemo(() => buildInitialRange(items), [items]);
  const [editableItems, setEditableItems] = useState<EditableRoadmapItem[]>(
    () => normalizeItems(items),
  );
  const [activeItemId, setActiveItemId] = useState<number | null>(items[0]?.id ?? null);
  const [editorScrollRequest, setEditorScrollRequest] = useState(0);
  const [visibleTime, setVisibleTime] = useState(initialRange);
  const editorPanelRef = useRef<HTMLElement | null>(null);
  const editorHeaderRef = useRef<HTMLDivElement | null>(null);
  const editorItemRefs = useRef<Record<number, HTMLElement | null>>({});

  useEffect(() => {
    moment.locale(copy.momentLocale);
  }, [copy.momentLocale]);

  useEffect(() => {
    setEditableItems(normalizeItems(items));
    setActiveItemId(items[0]?.id ?? null);
  }, [items]);

  useEffect(() => {
    setVisibleTime(initialRange);
  }, [initialRange]);

  const scrollEditorItemIntoView = useCallback((itemId: number) => {
    const panel = editorPanelRef.current;
    const header = editorHeaderRef.current;
    const item = editorItemRefs.current[itemId];

    if (!panel || !item) {
      return;
    }

    const panelRect = panel.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const headerHeight = header?.offsetHeight ?? 0;
    const itemTop = itemRect.top - panelRect.top + panel.scrollTop;
    const itemBottom = itemTop + itemRect.height;
    const visibleTop = panel.scrollTop + headerHeight + editorScrollGap;
    const visibleBottom = panel.scrollTop + panel.clientHeight - editorScrollGap;
    let nextScrollTop = panel.scrollTop;

    if (itemTop < visibleTop) {
      nextScrollTop = itemTop - headerHeight - editorScrollGap;
    } else if (itemBottom > visibleBottom) {
      nextScrollTop = itemBottom - panel.clientHeight + editorScrollGap;
    }

    if (Math.abs(nextScrollTop - panel.scrollTop) < 1) {
      return;
    }

    panel.scrollTo({
      top: Math.max(0, nextScrollTop),
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    if (activeItemId === null) {
      return;
    }

    window.requestAnimationFrame(() => scrollEditorItemIntoView(activeItemId));
  }, [activeItemId, editorScrollRequest, scrollEditorItemIntoView]);

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
          start_time: getTimelineStartMs(item.startDate),
          end_time: getTimelineEndMs(item.endDate),
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

  const focusTimelineItem = useCallback(
    (itemId: number) => {
      const target = editableItems.find((item) => item.id === itemId);

      if (!target) {
        return;
      }

      const start = getTimelineStartMs(target.startDate);
      const end = getTimelineEndMs(target.endDate);
      const duration = Math.max(end - start, hourMs);
      const padding = Math.max(duration * 0.7, 8 * hourMs);
      const rawStart = start - padding;
      const rawEnd = end + padding;
      const rawSpan = rawEnd - rawStart;
      const nextSpan = clamp(rawSpan, minZoom, maxZoom);
      const center = (start + end) / 2;

      setVisibleTime({
        start: center - nextSpan / 2,
        end: center + nextSpan / 2,
      });
    },
    [editableItems],
  );

  const selectTimelineItem = useCallback(
    (itemId: number, shouldFocusTimeline = false) => {
      setActiveItemId(itemId);
      setEditorScrollRequest((current) => current + 1);

      if (shouldFocusTimeline) {
        focusTimelineItem(itemId);
      }
    },
    [focusTimelineItem],
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

          const duration = getTimelineEndMs(item.endDate) - getTimelineStartMs(item.startDate);

          return {
            ...item,
            group: Number(nextGroup.id),
            startDate: toDateTimeInputValue(dragTime),
            endDate: toDateTimeInputValue(dragTime + duration, 'end'),
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
                startDate: edge === 'left' ? toDateTimeInputValue(time) : item.startDate,
                endDate: edge === 'right' ? toDateTimeInputValue(time, 'end') : item.endDate,
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
        boxShadow: itemContext.selected ? '0 0 0 3px rgba(37, 99, 235, 0.22)' : undefined,
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
  const shouldUseNowMarker = currentVisibleSpan <= nowMarkerVisibleSpan;
  const markerLabel = shouldUseNowMarker ? copy.markerLabels.now : copy.markerLabels.today;
  const axisHeaderData = useMemo(() => buildAxisHeaderData(copy), [copy]);

  const formatPrimaryHeader = useCallback(
    ([startTime]: [Moment, Moment], unit: Unit) => {
      const start = startTime.clone().locale(copy.momentLocale);

      if (unit === 'year') {
        return start.format('YYYY');
      }

      if (unit === 'month') {
        return start.format(copy.momentLocale === 'ko' ? 'YYYY년 MMMM' : 'MMMM YYYY');
      }

      if (unit === 'day' || unit === 'hour' || unit === 'minute') {
        return start.format('LL');
      }

      return start.format('ll');
    },
    [copy.momentLocale],
  );

  const formatDateHeader = useCallback(
    ([startTime]: [Moment, Moment], unit: Unit, labelWidth: number) => {
      const start = startTime.clone().locale(copy.momentLocale);

      if (unit === 'minute') {
        const minute = start.minute();
        const isHourStart = minute === 0;
        const isHalfHour = minute === 30;

        if (labelWidth < sparseTimeLabelWidth) {
          return isHourStart ? formatHourLabel(start, copy.momentLocale) : '';
        }

        if (labelWidth < compactTimeLabelWidth) {
          return isHourStart || isHalfHour
            ? formatMinuteLabel(start, copy.momentLocale)
            : '';
        }

        return formatMinuteLabel(start, copy.momentLocale);
      }

      if (unit === 'hour') {
        const hour = start.hour();
        const isSixHourMark = hour % 6 === 0;
        const isThreeHourMark = hour % 3 === 0;

        if (labelWidth < sparseTimeLabelWidth) {
          return isSixHourMark ? formatHourLabel(start, copy.momentLocale) : '';
        }

        if (labelWidth < compactTimeLabelWidth) {
          return isThreeHourMark ? formatHourLabel(start, copy.momentLocale) : '';
        }

        if (labelWidth < comfortableTimeLabelWidth) {
          return formatHourLabel(start, copy.momentLocale);
        }

        return formatMinuteLabel(start, copy.momentLocale);
      }

      if (unit === 'day') {
        const dayOfMonth = start.date();
        const isMonthStart = dayOfMonth === 1;
        const isFiveDayMark = dayOfMonth % 5 === 0;
        const isMidMonth = dayOfMonth === 15;
        const isMonday = start.isoWeekday() === 1;

        if (currentVisibleSpan >= veryWideDayLabelSpan) {
          return isMonthStart ? formatNarrowDateLabel(start) : '';
        }

        if (currentVisibleSpan >= wideDayLabelSpan) {
          return isMonthStart || isMidMonth
            ? isMonthStart
              ? formatNarrowDateLabel(start)
              : start.format('D')
            : '';
        }

        if (labelWidth < sparseDayLabelWidth) {
          return isMonthStart || isFiveDayMark
            ? isMonthStart
              ? formatNarrowDateLabel(start)
              : start.format('D')
            : '';
        }

        if (labelWidth < compactDayLabelWidth) {
          return isMonthStart || isMonday
            ? isMonthStart
              ? formatNarrowDateLabel(start)
              : start.format('D')
            : '';
        }

        if (labelWidth < comfortableDayLabelWidth) {
          return start.format('D');
        }

        return start.format(copy.momentLocale === 'ko' ? 'D일 ddd' : 'ddd D');
      }

      if (unit === 'month') {
        return start.format('MMM');
      }

      return start.format('ll');
    },
    [copy.momentLocale, currentVisibleSpan],
  );

  return (
    <TimelineWorkbench>
      <EditorPanel ref={editorPanelRef} aria-label={copy.editorLabel}>
        <div ref={editorHeaderRef} className="timeline-editor__header">
          <strong>{copy.editorTitle}</strong>
          <span>{copy.editorDescription}</span>
        </div>
        <div className="timeline-editor__list">
          {editableItems.map((item) => (
            <article
              key={item.id}
              ref={(node) => {
                editorItemRefs.current[item.id] = node;
              }}
              className={[
                'timeline-editor__item',
                activeItemId === item.id ? 'is-active' : undefined,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => selectTimelineItem(item.id, true)}
              onFocusCapture={() => selectTimelineItem(item.id, true)}
            >
              <div className="timeline-editor__top">
                <strong className="timeline-editor__item-id">
                  {item.id.toString().padStart(2, '0')}
                </strong>
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
                      type="datetime-local"
                      value={toDateTimeInputValue(item.startDate)}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        updateItem(item.id, { startDate: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    {copy.endLabel}
                    <input
                      type="datetime-local"
                      value={toDateTimeInputValue(item.endDate, 'end')}
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
      <div className="timeline-shell" aria-label={copy.shellLabel}>
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
            key={`timeline-${copy.momentLocale}`}
            groups={calendarGroups}
            items={calendarItems}
            keys={timelineKeys}
            visibleTimeStart={visibleTime.start}
            visibleTimeEnd={visibleTime.end}
            selected={activeItemId === null ? [] : [activeItemId]}
            onTimeChange={handleTimeChange}
            onItemMove={handleItemMove}
            onItemResize={handleItemResize}
            onItemClick={(itemId) => selectTimelineItem(Number(itemId))}
            onItemSelect={(itemId) => selectTimelineItem(Number(itemId))}
            canMove
            canResize="both"
            canChangeGroup
            useResizeHandle
            itemTouchSendsClick={false}
            itemHeightRatio={0.75}
            lineHeight={48}
            minZoom={minZoom}
            maxZoom={maxZoom}
            dragSnap={halfHourMs}
            sidebarWidth={170}
            stackItems
            itemRenderer={itemRenderer}
            groupRenderer={groupRenderer}
          >
            <TimelineHeaders>
              <SidebarHeader<AxisHeaderData> headerData={axisHeaderData}>
                {({ getRootProps, data }) => (
                  <div
                    {...getRootProps()}
                    className="timeline-axis-header"
                    aria-label={data.ariaLabel}
                  >
                    <span className="timeline-axis-header__group">{data.groupLabel}</span>
                    <span className="timeline-axis-header__time">{data.timeLabel}</span>
                  </div>
                )}
              </SidebarHeader>
              <DateHeader key={`primary-${copy.momentLocale}`} unit="primaryHeader" labelFormat={formatPrimaryHeader} />
              <DateHeader key={`date-${copy.momentLocale}`} labelFormat={formatDateHeader} />
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
      </div>
    </TimelineWorkbench>
  );
};
