import { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useInView } from 'framer-motion';
import styled from 'styled-components';
import { useSWRConfig } from 'swr';
import { useAuthSWRInfinite, useAuthSWRMutation } from 'hooks/authSWR';

import NotiItem from './NotiItem';
import { RootState } from 'store';
import { fetcher, updater } from 'api';
import Loading from '@components/Loading';
import { ModalType } from 'store/modalSlice';
import { CenterContainer } from 'styles/commonStyle';
import { Notification } from 'types/notification.type';
import { clearNewNotifications } from 'store/notificationSlice';

export default function NotiModal() {
  const pageSize = 10;
  const today = dayjs().format('YYYY-MM-DD');
  const dispatch = useDispatch();
  const { mutate } = useSWRConfig();

  const { currentModal } = useSelector((state: RootState) => state.modal);
  const { newNotifications } = useSelector((state: RootState) => state.notification);

  const listRef = useRef<HTMLUListElement>(null);
  const moreLoadRef = useRef<HTMLDivElement>(null);
  const isMoreLoadInView = useInView(moreLoadRef, {
    root: currentModal === ModalType.NOTIFICATION ? listRef : undefined,
    once: false,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<number[]>([]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.results.length) return null;
    return `/notifications?page=${pageIndex + 1}&pageSize=${pageSize}&date=${today}`;
  };

  // 유저의 알림 가져오기
  const { isLoading, data, setSize } = useAuthSWRInfinite(getKey, fetcher);

  // 모달 닫힐때 알림 전체적으로 읽기
  const { trigger: markRead } = useAuthSWRMutation('/notifications/read', updater);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  const onReadClick = (notificationId: number) => {
    if (!readNotificationIds.includes(notificationId)) {
      setReadNotificationIds((prev) => [...prev, notificationId]);

      setNotifications((prevNotifications) =>
        prevNotifications.map((noti: Notification) =>
          noti.id === notificationId
            ? {
                ...noti,
                readStatus: [
                  {
                    ...noti.readStatus[0],
                    isRead: true,
                  },
                ],
              }
            : noti,
        ),
      );
    }
  };

  useEffect(() => {
    if (isMoreLoadInView) {
      setSize((prev) => prev + 1);
    }
  }, [isMoreLoadInView]);

  // 알림 data 평탄화
  useEffect(() => {
    if (data) {
      const flatData = data.flatMap((page) => page.results);
      setNotifications(flatData);
    }
  }, [data]);

  useEffect(() => {
    if (newNotifications.length > 0) {
      setNotifications((prev: Notification[]) => [...newNotifications, ...prev]);
    }
  }, [newNotifications]);

  // 모달 닫으면 실행
  //  서버 통신 - ids 보내서 읽음처리
  // 모달 닫으면 실행
  useEffect(() => {
    return () => {
      if (readNotificationIds.length > 0) {
        // 서버에 읽음 요청
        markRead({
          formData: {
            notificationIds: readNotificationIds,
            isRead: true,
          },
        });
      }
      dispatch(clearNewNotifications());
      mutate('/notifications/unreadCount');
    };
  }, [readNotificationIds]);

  if (isLoading) {
    return (
      <Background>
        <CenterContainer>
          <Loading color="#279EFF" />
        </CenterContainer>
      </Background>
    );
  }

  if (isEmpty) {
    return (
      <Background>
        <CenterContainer>
          <div>알림이 없습니다</div>
        </CenterContainer>
      </Background>
    );
  }

  return (
    <Background>
      <List ref={listRef}>
        {notifications.map((notification: Notification) => (
          <NotiItem key={notification.id} notification={notification} onReadClick={onReadClick} />
        ))}

        {!isEnd && (
          <CenterContainer ref={moreLoadRef}>
            <Loading color="#279EFF" />
          </CenterContainer>
        )}
      </List>
    </Background>
  );
}

const Background = styled.div`
  min-width: 120px;
  max-height: 300px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.background.box.default.primary};
  box-shadow: ${({ theme }) => theme.shadow.dp01};
  border-radius: ${({ theme }) => theme.radius.normal};
  overflow-y: auto;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
