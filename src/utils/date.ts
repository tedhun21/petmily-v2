import dayjs, { Dayjs } from 'dayjs';

import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import type { ChatMessage } from '@/types/chat.type';

// Day.js 플러그인 확장 로케일 설정
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(isBetween);
dayjs.locale('ko');
dayjs.extend(customParseFormat);

// 오전/오후 한글 표기
dayjs.updateLocale('ko', {
  meridiem: (hour: number) => (hour < 12 ? '오전' : '오후'),
});

/**  날짜를 { year, month, day } 객체로 반환 */
export const dateFormat = (date: string) => {
  const year = dayjs(date).format('YYYY');
  const month = dayjs(date).format('MM');
  const day = dayjs(date).format('DD');
  return { year, month, day };
};

/** 요일(월, 화, ...) 반환 */
export const dayFormat = (date: string) => {
  return dayjs(date).locale('ko').format('ddd');
};

/** 시간 범위 문자열 반환 (예 "10:00 ~ 17:00") */
export const timeRange = (start: string | null, end: string | null) => {
  if (!start || !end) {
    return null;
  }

  const parseFormat = (time: string) => (time.split(':').length === 3 ? 'HH:mm:ss' : 'HH:mm');

  // dayjs(문자열, 형식)으로 파싱
  const formattedStart = dayjs(start, parseFormat(start)).format('HH:mm');
  const formattedEnd = dayjs(end, parseFormat(end)).format('HH:mm');

  return `${formattedStart} ~ ${formattedEnd}`;
};

/** "몇 년 전", "며칠 전" e등의 상대 시간 반환 */
export const dateAgo = (date: string) => {
  const target = dayjs(date);
  return target.isValid() ? target.from(dayjs()) : 'Invalid date';
};

/** 채팅 리스트에서 업데이트 시간 표기 */
export const updatedAtAgo = (date: string) => {
  if (!date) return null;

  const target = dayjs(date);
  const now = dayjs();

  if (target.isSame(now, 'day')) return target.format('A h:mm');
  if (target.isSame(now.subtract(1, 'day'), 'day')) return '어제';
  if (target.isSame(now, 'year')) return target.format('M월 DD일');
  return target.format('YYYY년 MM월 DD일');
};

/** 예약 불가 날짜 계산 */
export const reservationDisableDate = (day: Dayjs) => {
  const now = dayjs();
  const limit = now.add(2, 'M').format('YYYY-MM-DD');

  // 오늘 ~ 2개월 이내 날짜만 선택 가능
  return !dayjs(dayjs(day).format('YYYY-MM-DD')).isBetween(now, limit, 'day', '[)');
};

//** 체크인 불가 시간 계산 */
export const checkInDisableTime = (value: Dayjs, view: 'hours' | 'minutes' | 'seconds', date: string | null) => {
  const now = dayjs();
  if (date && dayjs(date).isValid()) {
    if (!now.isSame(dayjs(date), 'date')) return false;
    if (view === 'hours' && value.hour() < now.hour() + 2) return true;
  }

  return false;
};

/** 체크아웃 불가 시간 계산 */
export const checkOutDisableTime = (
  value: Dayjs,
  view: 'hours' | 'minutes' | 'seconds',
  reservationTimeStart: Dayjs | null,
) => {
  if (reservationTimeStart?.isValid()) {
    if (view === 'hours' && value.hour() < reservationTimeStart?.add(1, 'hour').hour()) {
      return true;
    }
  }

  return false;
};

/** 요일 배열 */
export const weekdays = [
  { id: 1, value: 'mon', label: '월' },
  { id: 2, value: 'tue', label: '화' },
  { id: 3, value: 'wed', label: '수' },
  { id: 4, value: 'thu', label: '목' },
  { id: 5, value: 'fri', label: '금' },
  { id: 6, value: 'sat', label: '토' },
  { id: 7, value: 'sun', label: '일' },
];

/** 로컬 AM/PM 표기 (예: 오전 10:30) */
export function formatToLocaleAMPM(dateString: string) {
  return dayjs(dateString).locale('ko').format('A h:mm');
}

/** 발신자 프로필 사진 표시 여부 */
export const shouldShowSenderPhoto = (current: ChatMessage, previous?: ChatMessage) => {
  if (!previous) return true;

  // 1. 이전 메시지와 같은 '분'이 아닐 때 O
  const isSameMinute = dayjs(current.createdAt).isSame(previous.createdAt, 'minute');
  // 2. 이전 메시지와 같은 유저가 아닐 때 O
  const isSameSender = current.sender?.id === previous.sender?.id;

  return !(isSameMinute && isSameSender);
};

/** 닉네임 표시 여부 */
export const shouldShowNickname = (current: ChatMessage, previous?: ChatMessage) => {
  // 이전 메세지가 없을 경우
  if (!previous) return true;

  // 1. 이전 메시지와 다른 유저일 때 O
  const isDifferentSender = current.sender?.id !== previous.sender?.id;

  // 2. 요일에 첫번째 일 때 O
  const isFirstOfDay = !dayjs(current.createdAt).isSame(previous.createdAt, 'day');

  // 3. 이전 메시지와 '분'이 다를 때 O
  const isDifferentMinute = !dayjs(current.createdAt).isSame(previous.createdAt, 'minute');

  return isDifferentSender || isFirstOfDay || isDifferentMinute;
};

/** 시간 표시 여부 */
export const shouldShowTime = (current: ChatMessage, previous?: ChatMessage, next?: ChatMessage) => {
  // previous 메시지와 '분' 같으면 O
  const isSameMinutePrev = previous && dayjs(current.createdAt).isSame(previous.createdAt, 'minute');
  // previous 메시지와 '유저' 같으면 X
  const isSameSenderPrev = previous && current.sender?.id === previous.sender?.id;

  // next 메시지와 '분'과 같으면 X
  const isSameMinuteNext = next && dayjs(current.createdAt).isSame(next?.createdAt, 'minute');
  // next 메시지와 유저와 같으면 X
  const isSameSenderNext = next && current.sender?.id === next.sender?.id;

  // 이전 메시지와 분은 같지만, 발신자가 다르면 => 시간 표시
  if (isSameMinutePrev && !isSameSenderPrev) return true;

  // 다음 메시지와 분·발신자가 모두 같으면 => 시간 표시 안 함
  if (isSameMinuteNext && isSameSenderNext) return false;

  // 그 외에는 시간 표시
  return true;
};

/** 날짜 구분선 표시 여부 */
export const shouldShowDateDivider = (current: ChatMessage, previous?: ChatMessage) => {
  return !previous || !dayjs(current.createdAt).isSame(previous?.createdAt, 'day');
};

/** 시간 옵션 리스트 생성 (08:00 ~ 21:30, 30분 간격) */
export const timeOptions = (): string[] => {
  const times: string[] = [];
  for (let i = 8; i < 22; i++) {
    times.push(`${String(i).padStart(2, '0')}:00`);
    times.push(`${String(i).padStart(2, '0')}:30`);
  }
  return times;
};

//** 선택된 시간이 시간 범위 내에 포함되는지 */
export const isTimeBetween = (
  time: string,
  startTime: string | null,
  endTime: string | null,
  unit: 'hour' | 'minute' = 'minute',
  inclusivity: '()' | '[]' | '[)' | '(]' = '[]',
) => {
  const startTimeDayjs = dayjs(startTime, 'HH:mm');
  const endTimeDayjs = dayjs(endTime, 'HH:mm');
  const timeDayjs = dayjs(time, 'HH:mm');
  return timeDayjs.isBetween(startTimeDayjs, endTimeDayjs, unit, inclusivity);
};
