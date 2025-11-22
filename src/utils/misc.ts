import dayjs from 'dayjs';

import { ChatMessage } from '@/types/chat.type';

export const formatStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return '대기중';
    case 'accepted':
      return '예약확정';
    case 'canceled':
      return '취소됨';
    case 'completed':
      return '완료됨';
  }
};

/**
 * 마지막으로 읽은 메시지와 지금 메시지의 비교
 */
export const isMessageUnread = (target: ChatMessage, reference?: ChatMessage | null) =>
  reference ? dayjs(target.createdAt).isAfter(reference.createdAt) : true;

export const makeOpponentQuery = (opponentIds: string[]) => {
  return opponentIds.map((id) => `opponentIds=${id}`).join('&');
};
