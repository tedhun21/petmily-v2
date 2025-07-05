import dayjs from 'dayjs';
import { ModalType } from 'store/modalSlice';
import { Message } from 'types/chat.type';

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

export const isSearchModal = (modalType: ModalType | null): boolean => {
  return modalType !== null && modalType.startsWith('search_');
};

export const isAfterMessage = (target: Message, reference?: Message | Pick<Message, 'id' | 'createdAt'> | null) => {
  if (!reference) return true; // 기준 메시지가 없으면 모두 안 읽은 것으로 처리
  return (
    dayjs(target.createdAt).isAfter(reference.createdAt) ||
    (dayjs(target.createdAt).isSame(reference.createdAt) && target.id > reference.id)
  );
};
