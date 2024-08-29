import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    // past: '%s ago',
    past: '%s 전',
    // s: 'a few seconds',
    s: '몇 초',
    // m: 'a minute',
    // mm: '%d minutes',
    mm: '%d 분',
    // h: 'an hour',
    // hh: '%d hours',
    hh: '%d 시간',
    // d: 'an day',
    d: '하루',
    //  dd: '%d days',
    dd: '%d 일',
    // M: 'a month',
    MM: '%d 개월',
    // y: 'a year',
    yy: '%d 년',
  },
});

export const parsePossibleDay = (data: string): string[] => {
  try {
    const parsed = JSON.parse(data);

    // 파싱된 결과가 배열이 아닌 경우 빈 배열 반환
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Failed to parse JSON, returning empty array:', error);
    return [];
  }
};

export const timeRange = (start: string, end: string) => {
  const formattedStart = dayjs(start, 'HH:mm:ss').format('HH:mm');
  const formattedEnd = dayjs(end, 'HH:mm:ss').format('HH:mm');

  if (!start || !end) {
    return null;
  }

  return `${formattedStart} ~ ${formattedEnd}`;
};

export const dateAgo = (date: string) => {
  const now = dayjs();
  const theDay = dayjs(date);

  const agoTime = theDay.from(now);
  return agoTime;
};

export const dateFormat = (date: string) => {
  const year = dayjs(date).format('YYYY');
  const month = dayjs(date).format('MM');
  const day = dayjs(date).format('DD');
  return { year, month, day };
};
