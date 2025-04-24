import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import useSWRInfinite from 'swr/infinite';
import useSWRMutation from 'swr/mutation';
import { useDispatch, useSelector } from 'react-redux';

import dayjs from 'dayjs';
import styled from 'styled-components';
import { useInView } from 'framer-motion';
import { IoNotificationsOutline } from 'react-icons/io5';

import { RootState } from 'store';
import Loading from '@components/Loading';
import NotiItem from './component/NotiItem';
import { CenterContainer } from 'styles/commonStyle';
import { fetcherWithCookie, updaterWithCookie } from 'api';
import useOutsideClickModal from 'hooks/useOutsideClickModal';
import { closeModal, ModalType, openModal } from 'store/modalSlice';
import { markNotificationsAsRead, setNotifications } from 'store/notificationSlice';

const API_URL = process.env.REACT_APP_API_URL;

export default function NotiButton() {
  const dispatch = useDispatch();
  const notiContainer = document.getElementById('noti-container');
  const modalRef = useRef<HTMLDivElement>(null);
  useOutsideClickModal(modalRef);

  const listRef = useRef<HTMLUListElement>(null);
  const moreLoadRef = useRef<HTMLDivElement>(null);

  const pageSize = 10;
  const today = dayjs().format('YYYY-MM-DD');
  const [readNotificationIds, setReadNotificationIds] = useState<number[]>([]);

  const currentModal = useSelector((state: RootState) => state.modal.currentModal);
  const notifications = useSelector((state: RootState) => state.notification.notifications);

  const isMoreLoadInView = useInView(moreLoadRef, {
    root: currentModal === ModalType.NOTIFICATION ? listRef : undefined,
    once: false,
  });

  const unreadCount = notifications.filter((notification) => notification.readStatus[0].isRead === false).length;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.results.length) return null;
    return `${API_URL}/notifications?page=${pageIndex + 1}&pageSize=${pageSize}&date=${today}`;
  };

  // 유저의 알림 가져오기
  const { isLoading, data, setSize } = useSWRInfinite(getKey, fetcherWithCookie);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  // 모달 닫힐때 알림 전체적으로 읽기
  const { trigger } = useSWRMutation(`${API_URL}/notifications/read`, updaterWithCookie);

  const toggleNoti = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (currentModal === ModalType.NOTIFICATION) {
      dispatch(closeModal());
    } else {
      dispatch(openModal(ModalType.NOTIFICATION));
    }
  };

  const onInView = (notificationId: number) => {
    if (!readNotificationIds.includes(notificationId)) {
      setReadNotificationIds((prev) => [...prev, notificationId]);
    }
  };

  useEffect(() => {
    if (data) {
      const flatData = data.flatMap((page) => page.results);
      dispatch(setNotifications(flatData));
    }
  }, [data]);

  useEffect(() => {
    if (isMoreLoadInView) {
      setSize((prev) => prev + 1);
    }
  }, [isMoreLoadInView]);

  useEffect(() => {
    return () => {
      trigger({ formData: { notificationIds: readNotificationIds, isRead: true } });
      dispatch(markNotificationsAsRead(readNotificationIds));
      setReadNotificationIds([]);
    };
  }, [currentModal]);

  return (
    <NotiContaier id="noti-container">
      <Button type="button" onClick={toggleNoti}>
        <IoNotificationsOutline size="20px" />
        {unreadCount > 0 && (
          <UnreadCountContainer>
            <UnreadCount></UnreadCount>
          </UnreadCountContainer>
        )}
      </Button>
      {currentModal === ModalType.NOTIFICATION &&
        notiContainer &&
        createPortal(
          <NotiModal ref={modalRef}>
            <List ref={listRef}>
              {notifications.length > 0 &&
                notifications.map((notification: any) => (
                  <NotiItem key={notification.id} notification={notification} onInView={onInView} />
                ))}
              {!isEnd && (
                <CenterContainer ref={moreLoadRef}>
                  <Loading color="#279EFF" />
                </CenterContainer>
              )}
            </List>
          </NotiModal>,
          notiContainer,
        )}
    </NotiContaier>
  );
}

const Button = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;

  border-radius: ${({ theme }) => theme.radius.normal};
  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }
`;

const UnreadCountContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const UnreadCount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background-color: ${({ theme }) => theme.background.red};
  border-radius: ${({ theme }) => theme.radius.circle};
`;

const NotiContaier = styled.div`
  position: relative;
`;

const NotiModal = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 20;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 16px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: ${({ theme }) => theme.radius.normal};
  background-color: ${({ theme }) => theme.background.box.default.primary};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;
