import dayjs, { Dayjs } from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(isBetween);

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

const now = new Date();
const nowDate = dayjs(now).format('YYYY-MM-DD');
const nowTime = dayjs(now).format('HH:mm:ss');

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

export const reservationDisableDate = (day: string) => {
  // 날짜에 할당된 숫자 구하기 (0이면 일요일, 1이면 월요일)
  const dayOfWeek = dayjs(day).day();
  // 일요일,월요일면 주말
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // now로부터 3개월 이후에만 date 선택가능 범위
  const nowAddThreeMonth = dayjs(now).add(3, 'M').format('YYYY-MM-DD');

  // 3개월 이내와 주말 이외에만 예약 가능 (true면 비활성화, false는 활성화)
  return !dayjs(dayjs(day).format('YYYY-MM-DD')).isBetween(nowDate, nowAddThreeMonth, 'day', '[)') || isWeekend;
};

export const checkInDisableTime = (value: Dayjs, view: 'hours' | 'minutes' | 'seconds', date: string | null) => {
  const currentTime = dayjs();

  // 오늘 reservationDate와 다르면 활성화
  if (!currentTime.isSame(dayjs(date), 'date')) {
    return false;
  }

  // 지금 현재 시 보다 늦으면 true
  if (view === 'hours') {
    if (value.hour() < currentTime.hour() + 2) {
      return true;
    }
  }

  // 30분만 활성화
  // if (view === 'minutes') {
  //   if (value.minute() % 30 !== 0) {
  //     return false;
  //   }
  // }

  // return 값이 true면 비활성화 false면 활성화
  return false;
};

export const checkOutDisableTime = (
  value: Dayjs,
  view: 'hours' | 'minutes' | 'seconds',
  reservationTimeStart: Dayjs | null,
) => {
  if (reservationTimeStart) {
    // start time + 1 시간보다 작은 시간만 비활성화
    if (view === 'hours') {
      if (value.hour() < dayjs(reservationTimeStart, 'HH:mm').add(1, 'hour').get('hour')) {
        return true;
      }
    }

    // 30분 간격만 선택되게
    // if (view === 'minutes') {
    //   if (value.minute() % 30 !== 0) {
    //     return false;
    //   }
    // }
  }
  return false;
};
