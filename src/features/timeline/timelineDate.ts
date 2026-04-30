import moment from 'moment';

export const hourMs = 60 * 60 * 1000;
export const halfHourMs = 30 * 60 * 1000;
export const dayMs = 24 * hourMs;

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export const getTimelineStartMs = (value: string | number) => moment(value).valueOf();

export const getTimelineEndMs = (value: string | number) => {
  if (typeof value === 'string' && dateOnlyPattern.test(value)) {
    return moment(value).endOf('day').valueOf();
  }

  return moment(value).valueOf();
};

export const toDateTimeInputValue = (
  value: string | number,
  edge: 'start' | 'end' = 'start',
) => {
  const source =
    typeof value === 'string' && dateOnlyPattern.test(value) && edge === 'end'
      ? moment(value).endOf('day')
      : moment(value);

  return source.format('YYYY-MM-DDTHH:mm');
};
