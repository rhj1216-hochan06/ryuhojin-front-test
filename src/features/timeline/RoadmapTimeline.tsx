import type { CSSProperties } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment, { type Moment } from 'moment';
import styled from 'styled-components';
import type { RoadmapGroup, RoadmapItem, RoadmapStatus } from '../../types/dashboard';

interface RoadmapTimelineProps {
  groups: RoadmapGroup[];
  items: RoadmapItem[];
}

interface CalendarGroup {
  id: number;
  title: string;
  rightTitle: string;
}

interface CalendarItem {
  id: number;
  group: number;
  title: string;
  start_time: Moment;
  end_time: Moment;
  itemProps: {
    style: CSSProperties;
  };
}

const statusColor: Record<RoadmapStatus, string> = {
  done: '#0f766e',
  active: '#2563eb',
  planned: '#b45309',
};

const TimelineShell = styled.div`
  overflow: hidden;
  border: 1px solid #d7dee6;
  border-radius: 8px;
  background: #ffffff;

  .react-calendar-timeline {
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
    border: 0;
    border-radius: 8px;
    font-weight: 800;
  }

  @media (max-width: 760px) {
    overflow-x: auto;

    .react-calendar-timeline {
      min-width: 760px;
    }
  }
`;

export const RoadmapTimeline = ({ groups, items }: RoadmapTimelineProps) => {
  const calendarGroups: CalendarGroup[] = groups.map((group) => ({
    id: group.id,
    title: group.title,
    rightTitle: group.owner,
  }));

  const calendarItems: CalendarItem[] = items.map((item) => ({
    id: item.id,
    group: item.group,
    title: `${item.title} · ${item.progress}%`,
    start_time: moment(item.startDate),
    end_time: moment(item.endDate).endOf('day'),
    itemProps: {
      style: {
        background: statusColor[item.status],
        border: '0',
        color: '#ffffff',
      },
    },
  }));

  return (
    <TimelineShell aria-label="Portfolio roadmap timeline">
      <Timeline
        groups={calendarGroups}
        items={calendarItems}
        defaultTimeStart={moment('2026-04-01')}
        defaultTimeEnd={moment('2026-04-30')}
        canMove={false}
        canResize={false}
        canChangeGroup={false}
        itemHeightRatio={0.72}
        lineHeight={48}
        sidebarWidth={150}
        stackItems
      />
    </TimelineShell>
  );
};

