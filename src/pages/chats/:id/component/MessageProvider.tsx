import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ChatMember, ChatRoom, Message } from 'types/chat.type';
import { ChatRoomContext } from './ChatRoomProvider';
import { SocketContext } from '@components/SocketProvider';
import useSWRInfinite from 'swr/infinite';
import { fetcherWithCookie } from 'api';
import { API_URL } from 'config';
import dayjs from 'dayjs';
import { useDebounce } from 'hooks/useDebounce';

interface MessageContextType {
  fetchedMessages: Message[];
  newMessages: Message[];
  setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
  isLoading: boolean;
  isEnd: boolean | undefined;
  onMessageVisible: (message: Message) => void;
}

// 서버 메시지 (페이징 포함) 상태 관리만 담당
export const MessageContext = createContext<MessageContextType>({
  fetchedMessages: [],
  newMessages: [],
  setSize: async () => [],
  isLoading: false,
  isEnd: undefined,
  onMessageVisible: () => null,
});

// 1. 과거 메시지 로딩 및 관리
// 2. 프론트엔드 메시지 읽음 처리 유틸 함수 (markMessagesAsReadLocally)
// 3. 읽음 처리 서버 전송 로직 (수동 디바운스 및 플러시 포함)
// 4. 컴포넌트 언마운트시 읽음 처리 강제 전송
// 5. 메시지 가시성 감지 및 읽음 처리 트리거
// 6. 실시간 새 메시지 수신 관리
// 7. 상대방의 읽음 처리 업데이트 수신 및 UI 반영
// 8. 메시지 관련 데이터 및 콜백 제공
export default function MessageProvider({ children }: any) {
  const pageSize = 50;
  const { socket } = useContext(SocketContext);
  const { chatRoom, setChatRoom } = useContext(ChatRoomContext);
  const meUser = chatRoom?.chatMembers.me.user;

  const [newMessages, setNewMessages] = useState<Message[]>([]);

  // 읽음 처리 상태 및 디바운스 로직을 위한 Ref들 (잦은 리랜더링에 의한 에러 방지 위해 ref)
  // 또한, 디바운스 처리시, 불필요한 새로운 함수 인스터스 생성 방지
  const latestSeenMessageInfoRef = useRef<{ id: number; createdAt: string } | null>(null);

  // 1. 과거 메시지 데이터 로딩 및 관리
  // getKey는 setSize로 다시 불릴 때, pageIndex = 0 부터 캐시되어 있는 것을 다시 반복해서 부른다.
  // 하지만 pageIndex = 0인 부분은 "최신 데이터를 보장하는 위한 SWR의 기본 전략"이기 때문에 첫번째 페이지는 백엔드에 통신을 보낸다.
  // 그러나 캐시만 사용하고 싶은면   revalidateFirstPage: false => 첫 페이지 재검증 비활성화 옵션을 키는 것이 좋다
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!chatRoom?.id) return null;

    const baseKey = `${API_URL}/chats/${chatRoom.id}/messages`;
    // 끝났으면 요청하지 않음
    if (pageIndex === 0 && !previousPageData) {
      return `${baseKey}?pageSize=${pageSize}`;
    }
    // 다음 페이지가 있고 hasNextPage가 true일 때만 cursor를 포함한 URL 반환
    if (previousPageData?.pagination?.hasNextPage && previousPageData.pagination.nextCursor) {
      const nextCursor = previousPageData.pagination.nextCursor;
      return `${baseKey}?cursor=${nextCursor}&pageSize=${pageSize}`;
    }
    return null; // hasNextPage가 false이거나 previousPageData가 없는 경우 null 반환
  };
  const { data, setSize, isLoading } = useSWRInfinite(getKey, fetcherWithCookie);
  const fetchedMessages = data ? data.flatMap((page) => page.results) : [];
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  // 2. 프론트엔드 메시지 읽음 처리 유틸 함수
  // 특정 메시지까지 지정된 사용자가 읽었음을 로컬에서 처리(UI 업데이트용)하는 순수 함수
  const updateChatMemberLastReadMessage = (chatRoom: ChatRoom, userId: number, lastReadMessage: Message) => {
    if (!chatRoom) return chatRoom;

    // chatMembers 객체 구조: { me: ChatMember, others: ChatMember[] }
    const updatedOthers = chatRoom.chatMembers.others.map((member: ChatMember) => {
      if (member.user.id === userId) {
        const currentLastRead = member.lastReadMessage;

        // 업데이트할 메시지가 현재보다 더 최신일 때만 변경
        if (
          !currentLastRead ||
          dayjs(lastReadMessage.createdAt).isAfter(dayjs(currentLastRead.createdAt)) ||
          (dayjs(lastReadMessage.createdAt).isSame(dayjs(currentLastRead.createdAt), 'second') &&
            lastReadMessage.id > currentLastRead.id)
        ) {
          return {
            ...member,
            lastReadMessage,
          };
        }
      }
      return member;
    });

    return {
      ...chatRoom,
      chatMembers: {
        ...chatRoom.chatMembers,
        others: updatedOthers,
      },
    };
  };

  // 3. 읽음 처리 서버 전송 로직 (useDebounce 훅 사용)
  const sendReadReceiptToServer = useCallback(
    (messageId: number, messageCreatedAt: string) => {
      if (!socket || !chatRoom?.id || !meUser?.id || !messageId) return;

      socket.emit('chat:read:mark', {
        chatRoomId: chatRoom.id,
        lastReadMessageId: messageId,
        lastReadMessageCreatedAt: messageCreatedAt,
      });
    },
    [socket, chatRoom?.id, meUser?.id],
  );

  // useDebounce 훅을 사용하여 sendReadReceiptToServer를 디바운스 (1초)
  const { debouncedCallback: debouncedSendReadReceipt, flush } = useDebounce(sendReadReceiptToServer, 1000);

  // 4. 컴포넌트 언마운트/채팅방 변경 시 읽음 처리 강제 전송 (디바운스 대기중인 값 즉시 실행)
  useEffect(() => {
    return () => {
      flush(); // 대기 중인 디바운스 작업을 즉시 실행
    };
  }, [flush]);

  // 5. 메시지 가시성 감지 및 읽음 처리 트리거
  // `MessageItem`에서 특정 메시지가 화면에 보일 때 호출되는 콜백
  // 현재 본 메시지 중 가장 최신 메시지를 `lastSeenMessage` 상태로 업데이트하고,
  // 이 상태 변경이 `useEffect`를 통해 `customDebounce`를 트리거하여 서버에 읽음 요청을 보낸다.
  const onMessageVisible = useCallback(
    (message: Message) => {
      if (!message.id || !message.createdAt) return;

      const current = latestSeenMessageInfoRef.current;

      const isNewer =
        !current ||
        dayjs(message.createdAt).isAfter(dayjs(current.createdAt)) ||
        (dayjs(message.createdAt).isSame(dayjs(current.createdAt), 'second') && message.id > current.id);

      if (isNewer) {
        latestSeenMessageInfoRef.current = {
          id: message.id,
          createdAt: message.createdAt,
        };

        // 메시지가 실제로 최신일 경우에만 debounced 호출
        debouncedSendReadReceipt(message.id, message.createdAt);
      }
    },
    [debouncedSendReadReceipt],
  );

  // 6. 실시간 새 메시지 수신 및 관리
  // 소켓을 통해 새로운 메시지를 수신하고 `newMessages` 상태에 추가하여 즉시 UI에 반영
  // 채팅방 입장/퇴장 소켓 이벤트도 처리
  useEffect(() => {
    if (!socket || !chatRoom?.id) return;

    const chatRoomId = chatRoom.id.toString();

    const handleNewMessage = (newMessage: Message) => {
      setNewMessages((prev) => [newMessage, ...prev]);
    };

    socket.emit('chat:room:join', chatRoomId);
    socket.on('chat:room:message:new', handleNewMessage);

    return () => {
      socket.off('chat:room:message:new', handleNewMessage);
    };
  }, [socket, chatRoom?.id]);

  // 7. 상대방의 읽음 처리 업데이트 수신 및 UI 반영
  // 서버로부터 다른 사용자의 읽음 처리 상태 업데이트를 수신하여,
  // `newMessages`와 SWR 캐시(`fetchedMessages`)에 해당 변경 사항을 즉시 반영(UI 업데이트)
  useEffect(() => {
    if (!socket || !chatRoom?.id) return;

    const handleReadUpdateFromServer = (receivedData: { lastReadMessage: Message; userId: number }) => {
      const { lastReadMessage, userId } = receivedData;
      if (!lastReadMessage) return;

      setChatRoom((prevChatRoom: ChatRoom | null) =>
        prevChatRoom ? updateChatMemberLastReadMessage(prevChatRoom, userId, lastReadMessage) : prevChatRoom,
      );
    };

    socket.on('chat:room:read:update', handleReadUpdateFromServer);
    return () => {
      socket.off('chat:room:read:update', handleReadUpdateFromServer);
    };
  }, [socket, chatRoom?.id]);

  // 8. 메시지 관련 데이터 및 콜백 제공
  return (
    <MessageContext.Provider value={{ fetchedMessages, newMessages, setSize, isLoading, isEnd, onMessageVisible }}>
      {children}
    </MessageContext.Provider>
  );
}
