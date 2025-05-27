import dayjs, { Dayjs } from 'dayjs';

import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import isBetween from 'dayjs/plugin/isBetween';
import { Message } from 'types/chat.type';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(isBetween);
dayjs.locale('ko');

// 오전/오후 표기 한글로 설정
dayjs.updateLocale('ko', {
  meridiem: (hour: number) => (hour < 12 ? '오전' : '오후'),
});

// date format

/// { year, month, day }
export const dateFormat = (date: string) => {
  const year = dayjs(date).format('YYYY');
  const month = dayjs(date).format('MM');
  const day = dayjs(date).format('DD');
  return { year, month, day };
};

/// 요일 표시
export const dayFormat = (date: string) => {
  return dayjs(date).locale('ko').format('ddd');
};

/// 시간 범위 표시
/// 예) 10:00 ~ 17:00
export const timeRange = (start: string | null, end: string | null) => {
  if (!start || !end) {
    return null;
  }

  // 입력 형식을 동적으로 처리
  const startFormat = start.includes(':') && start.split(':').length === 3 ? 'HH:mm:ss' : 'HH:mm';
  const endFormat = end.includes(':') && end.split(':').length === 3 ? 'HH:mm:ss' : 'HH:mm';

  // 형식에 따라 시간 변환
  const formattedStart = dayjs(start, startFormat).format('HH:mm');
  const formattedEnd = dayjs(end, endFormat).format('HH:mm');

  return `${formattedStart} ~ ${formattedEnd}`;
};

/// 지난 시간 표시
/// 며칠 전, 몇 년전
export const dateAgo = (date: string) => {
  const theDay = dayjs(date);
  const now = dayjs();

  if (!theDay.isValid()) {
    return 'Invalid date';
  }

  return theDay.from(now);
};

// 채팅 리스트 업데이트 시간
export const updatedAtAgo = (date: string) => {
  if (!date) return null;

  const targetDate = dayjs(date);
  const now = dayjs();

  if (targetDate.isSame(now, 'day')) {
    return targetDate.format('A h:mm');
  } else if (targetDate.isSame(now.subtract(1, 'day'), 'day')) {
    return '어제';
  } else if (targetDate.isSame(now, 'year')) {
    return targetDate.format('M월 DD일');
  } else {
    return targetDate.format('YYYY년 MM월 DD일');
  }
};

export const reservationDisableDate = (day: Dayjs) => {
  // 날짜에 할당된 숫자 구하기 (0이면 일요일, 1이면 월요일)
  const dayOfWeek = dayjs(day).day();
  // 일요일,월요일면 주말
  // const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const now = dayjs();
  // now로부터 1개월 이후에만 date 선택가능 범위
  const nowAddThreeMonth = dayjs(now).add(2, 'M').format('YYYY-MM-DD');

  // 3개월 이내와 주말 이외에만 예약 가능 (true면 비활성화, false는 활성화)
  return !dayjs(dayjs(day).format('YYYY-MM-DD')).isBetween(now, nowAddThreeMonth, 'day', '[)');
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

export const weekdays = [
  { id: 1, value: 'mon', label: '월' },
  { id: 2, value: 'tue', label: '화' },
  { id: 3, value: 'wed', label: '수' },
  { id: 4, value: 'thu', label: '목' },
  { id: 5, value: 'fri', label: '금' },
  { id: 6, value: 'sat', label: '토' },
  { id: 7, value: 'sun', label: '일' },
];

export function formatToLocaleAMPM(dateString: string) {
  return dayjs(dateString).locale('ko').format('A h:mm');
}

// 같은 시간 && 같은 발신자 => 사진표시
export const shouldShowSenderPhoto = (currentMessage: Message, previousMessage?: Message) => {
  // 이전 메시지가 없으면 항상 표시
  if (!previousMessage) return true;

  // 현재 메시지와 이전 메시지가 같은 분인지 확인
  const isSameMinute = dayjs(currentMessage.createdAt).isSame(previousMessage.createdAt, 'minute');
  const isSameSender = currentMessage.sender?.id === previousMessage.sender?.id;

  // 1. 이전과 같은 시간 && 이전과 같은 sender ===> 현재 메시지 사진 false
  if (isSameMinute && isSameSender) {
    return false; // 사진을 표시하지 않음
  }

  // 2. 이전과 같은 시간 && 이전과 다른 sender ===> 현재 메시지 사진 true
  // 3. 이전과 다른 시간 && 이전과 같은 sender ===> 현재 메시지 사진 true
  // 4. 이전과 다른 시간 && 이전과 다른 sender ===> 현재 메시지 사진 true
  return true; // 조건 2, 3, 4의 경우 모두 사진을 표시
};

// 닉네임 표시
// 1. 이전 메세지가 없을 경우
// 2. 이전 메세지랑 현 메세지 작성자가 다른 사람일 때
// 3. 요일에 첫번째 일때
// 4. 이전 메세지와 분단위로 다를때
export const shouldShowNickname = (currentMessage: Message, previousMessage?: Message, nextMessage?: Message) => {
  // 이전 메세지가 없을 경우
  if (!previousMessage) return true;

  // 이전 메세지랑 현 메세지 작성자가가 다른 사람일 때
  const isDifferentSender = previousMessage.sender?.id !== currentMessage.sender?.id;

  // 요일에 첫번째일 때
  const isFirstMessageOfDay = !dayjs(currentMessage.createdAt).isSame(previousMessage.createdAt, 'day');

  // 이전 메세지와 분단위로 다를때
  const isDifferentMinute = !dayjs(currentMessage.createdAt).isSame(previousMessage.createdAt, 'minute');

  if (isDifferentSender || isFirstMessageOfDay || isDifferentMinute) {
    return true;
  }

  return false;
};

// 같은 시간의 메세지면 마지막 메세지에만 시간 보여주기
// 1. 다음 메시지가 현재랑 같고 && 같은 시간이면 현재 메세지에서는 false
// 2. 같은 시간이어도 이전 메시지가 상대방이면 현재 메세지에서는 true
export const shouldShowTime = (currentMessage: Message, previousMessage?: Message, nextMessage?: Message) => {
  const isSameMinuteWithPrevious = previousMessage
    ? dayjs(currentMessage.createdAt).isSame(previousMessage.createdAt, 'minute')
    : false;

  const isSameSenderWithPrevious = previousMessage ? currentMessage.sender?.id === previousMessage.sender?.id : false;

  const isSameMinuteWithNext = nextMessage
    ? dayjs(currentMessage.createdAt).isSame(nextMessage.createdAt, 'minute')
    : false;

  const isSameSenderWithNext = nextMessage ? currentMessage.sender?.id === nextMessage.sender?.id : false;

  // ✅ 다음 메시지와 같으면 false (시간 안 보여줌)
  if (isSameMinuteWithNext && isSameSenderWithNext) {
    return false;
  }

  // ✅ 이전 메시지가 다른 사람이면 true (시간 보여줌)
  if (isSameMinuteWithPrevious && !isSameSenderWithPrevious) {
    return true;
  }

  // ✅ 기본: 마지막 메시지거나 단독 메시지
  return true;
};

export const shouldShowDateDivider = (currentMessage: Message, previousMessage?: Message) => {
  if (!previousMessage) return true;
  return !dayjs(currentMessage.createdAt).isSame(previousMessage.createdAt, 'day');
};

// 시간 리스트 생성
export const timeOptions = (): string[] => {
  const times: string[] = [];
  for (let i = 8; i < 22; i++) {
    times.push(`${String(i).padStart(2, '0')}:00`);
    times.push(`${String(i).padStart(2, '0')}:30`);
  }
  return times;
};
