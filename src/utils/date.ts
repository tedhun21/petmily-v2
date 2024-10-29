import dayjs, { Dayjs } from 'dayjs';

import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import isBetween from 'dayjs/plugin/isBetween';
import { Message } from 'types/chat.type';

dayjs.locale('ko');
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(isBetween);

export const timeRange = (start: string, end: string) => {
  const formattedStart = dayjs(start, 'HH:mm:ss').format('HH:mm');
  const formattedEnd = dayjs(end, 'HH:mm:ss').format('HH:mm');

  if (!start || !end) {
    return null;
  }

  return `${formattedStart} ~ ${formattedEnd}`;
};

export const dateAgo = (date: string) => {
  const theDay = dayjs(date);
  const now = dayjs();

  if (!theDay.isValid()) {
    return 'Invalid date';
  }

  return theDay.from(now);
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
  // const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const now = dayjs();
  // now로부터 3개월 이후에만 date 선택가능 범위
  const nowAddThreeMonth = dayjs(now).add(3, 'M').format('YYYY-MM-DD');

  // 3개월 이내와 주말 이외에만 예약 가능 (true면 비활성화, false는 활성화)
  return !dayjs(dayjs(day).format('YYYY-MM-DD')).isBetween(now, nowAddThreeMonth, 'day', '[)');
  //  || isWeekend;
};

export const checkInDisableTime = (value: Dayjs, view: 'hours' | 'minutes' | 'seconds', date: string | null) => {
  const currentTime = dayjs();

  if (date && dayjs.isDayjs(dayjs(date))) {
    if (!currentTime.isSame(dayjs(date), 'date')) {
      return false;
    }

    if (view === 'hours' && value.hour() < currentTime.hour() + 2) {
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
  if (reservationTimeStart && dayjs.isDayjs(reservationTimeStart)) {
    if (view === 'hours' && value.hour() < reservationTimeStart.add(1, 'hour').hour()) {
      return true;
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

export const dayFormat = (date: string) => {
  return dayjs(date).locale('ko').format('ddd');
};

export const formatKrDays = (day: string) => {
  switch (day) {
    case 'Mon':
      return '월';
    case 'Tue':
      return '화';
    case 'Wed':
      return '수';
    case 'Thu':
      return '목';
    case 'Fri':
      return '금';
    case 'Sat':
      return '토';
    case 'Sun':
      return '일';
    default:
      return '';
  }
};

export const weekdays = [
  { id: 1, value: 'Mon', label: '월' },
  { id: 2, value: 'Tue', label: '화' },
  { id: 3, value: 'Wed', label: '수' },
  { id: 4, value: 'Thu', label: '목' },
  { id: 5, value: 'Fri', label: '금' },
  { id: 6, value: 'Sat', label: '토' },
  { id: 7, value: 'Sun', label: '일' },
];

export function formatToLocaleAMPM(dateString: string) {
  return dayjs(dateString).locale('ko').format('A h:mm');
}

// 같은 시간의 메세지면 첫번째 메세지에서만 사진 보여주기
export const shouldShowSenderPhoto = (currentMessage: Message, previousMessage?: Message) => {
  // 이전 메시지가 없으면 항상 표시
  if (!previousMessage) return true;

  // 현재 메시지와 이전 메시지가 같은 분인지 확인
  const isSameMinute = dayjs(currentMessage.createdAt).isSame(previousMessage.createdAt, 'minute');
  const isSameSender = currentMessage.sender.id === previousMessage.sender.id;

  // 1. 이전과 같은 시간 && 이전과 같은 sender ===> 현재 메시지 사진 false
  if (isSameMinute && isSameSender) {
    return false; // 사진을 표시하지 않음
  }

  // 2. 이전과 같은 시간 && 이전과 다른 sender ===> 현재 메시지 사진 true
  // 3. 이전과 다른 시간 && 이전과 같은 sender ===> 현재 메시지 사진 true
  // 4. 이전과 다른 시간 && 이전과 다른 sender ===> 현재 메시지 사진 true
  return true; // 조건 2, 3, 4의 경우 모두 사진을 표시
};

// 같은 시간의 메세지면 마지막 메세지에만 시간 보여주기
// 1. 다음 메시지가 현재랑 같고 && 같은 시간이면 현재 메세지에서는 false
// 2. 같은 시간이어도 이전 메시지가 상대방이면 현재 메세지에서는 true
export const shouldShowTime = (currentMessage: Message, previousMessage?: Message, nextMessage?: Message) => {
  // 첫 번째 메시지인 경우 시간을 항상 표시
  if (!previousMessage) return true;

  // 현재 메시지와 이전 메시지를 비교
  const isSameMinuteWithPrevious = dayjs(currentMessage.createdAt).isSame(previousMessage.createdAt, 'minute');
  const isSameSenderWithPrevious = currentMessage.sender.id === previousMessage.sender.id;

  // 현재 메시지와 다음 메시지를 비교
  const isSameMinuteWithNext = nextMessage && dayjs(currentMessage.createdAt).isSame(nextMessage.createdAt, 'minute');
  const isSameSenderWithNext = nextMessage && currentMessage.sender.id === nextMessage.sender.id;

  // 1. 다음 메시지가 현재 메시지와 같고 같은 시간이면 현재 메시지에서는 false
  if (isSameMinuteWithNext && isSameSenderWithNext) {
    return false; // 시간 표시 안 함
  }

  // 2. 같은 시간이어도 이전 메시지가 상대방이면 현재 메시지에서는 true
  if (isSameMinuteWithPrevious && !isSameSenderWithPrevious) {
    return true; // 시간 표시
  }

  // 기본적으로 시간 표시
  return true;
};

export const shouldShowDateDivider = (currentMessage: Message, previousMessage?: Message) => {
  if (!previousMessage) return true;
  return !dayjs(currentMessage.createdAt).isSame(previousMessage.createdAt, 'day');
};
