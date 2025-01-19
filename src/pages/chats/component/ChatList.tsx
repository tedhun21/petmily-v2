import { useContext, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import useSWRInfinite from 'swr/infinite';

import ChatMessage from './ChatMessage';
import { ChatContext } from './ChatProvider';
import { Message } from 'types/message.type';
import { infiniteFetcherWithCookie } from 'api';
import { useInView } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa6';
import { Button } from 'styles/commonStyle';

const API_URL = process.env.REACT_APP_API_URL;

export default function ChatList() {
  const pageSize = 30;

  const listRef = useRef<HTMLUListElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isBottomInView = useInView(bottomRef);
  const { socket, chatRoom, opponentId } = useContext(ChatContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);

  // const [isNewMessage, setIsNewMessage] = useState(false);
  const [showDownButton, setShowDownButton] = useState<boolean>(false);

  const scrollToBottom = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  // getKey는 setSize로 다시 불릴 때, pageIndex = 0 부터 캐시되어 있는 것을 다시 반복해서 부른다.
  // 하지만 pageIndex = 0인 부분은 "최신 데이터를 보장하는 위한 SWR의 기본 전략"이기 때문에 첫번째 페이지는 백엔드에 통신을 보낸다.
  // 그러나 캐시만 사용하고 싶은면   revalidateFirstPage: false => 첫 페이지 재검증 비활성화 옵션을 키는 것이 좋다
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!chatRoom) return null;

    const baseKey = `${API_URL}/chats/${chatRoom.id}/messages?opponentId=${opponentId}`;

    // 첫번째 페이지 호출
    if (pageIndex === 0 && !previousPageData) {
      return `${baseKey}&pageSize=${pageSize}`;
    }

    if (previousPageData && previousPageData.pagination.hasNextPage) {
      const nextCursor = previousPageData.pagination.nextCursor;
      return `${baseKey}&cursor=${nextCursor}&pageSize=${pageSize}`;
    }

    return null;
  };

  // 채팅방의 메세지 가져오기
  const { data, setSize, mutate } = useSWRInfinite(getKey, infiniteFetcherWithCookie);

  // 새 메시지를 받으면, mutate로 캐시를 갱신한 후 messages 배열을 강제로 업데이트
  useEffect(() => {
    if (data) {
      const updatedMessages = data.flatMap((page) => page.results).reverse();
      // messages 상태를 강제로 업데이트하는 방법
      setMessages(updatedMessages); // `setMessages`로 상태를 업데이트
    }
  }, [data]);

  // 새 메시지 리슨
  useEffect(() => {
    if (socket && chatRoom && opponentId) {
      socket.on('receive', (newMessage) => {
        mutate((currentData) => {
          if (!currentData) return;

          // 첫 번째 페이지에 새 메시지 추가
          const updatedPages = currentData.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                results: [newMessage, ...page.results], // 새 메시지 앞에 추가
              };
            }
            return page; // 다른 페이지는 그대로 반환
          });

          return updatedPages;
        }, false); // 네트워크 요청 없이 캐시만 업데이트
      });

      // 언마운트시 클리어
      return () => {
        socket.off('receive');
      };
    }
  }, [socket, chatRoom, opponentId]);

  // 처음 들어오면 채팅창 제일 밑
  useEffect(() => {
    if (listRef.current && messages.length > 0 && isFirstRender) {
      scrollToBottom(listRef);

      setIsFirstRender(false);
    }
  }, [messages]);

  // down 버튼 로직
  useEffect(() => {
    if (!listRef.current) return;

    const handleScroll = () => {
      const listElement = listRef.current;

      if (listElement) {
        const scrollTop = listElement.scrollTop; // 현재 스크롤 위치
        const scrollHeight = listElement.scrollHeight; // listRef의 높이
        const clientHeight = listElement.clientHeight; // 뷰포트 높이 (가시 영역의 높이)

        // 스크롤 위치를 퍼센트로 계산
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

        // 스크롤이 80% 이상이면 버튼 숨기기, 아니면 표시
        if (scrollPercentage < 70) {
          setShowDownButton(true);
        }

        // 스크롤이 끝에 도달했을 때 초기화
        if (scrollPercentage >= 100) {
          setShowDownButton(false);
        }
      }
    };

    const listElement = listRef.current;
    listElement?.addEventListener('scroll', handleScroll);

    return () => {
      listElement?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Div>
      <List ref={listRef}>
        {messages?.map((message: Message, index: number) => {
          const isMyMessage = message.sender.id !== Number(opponentId);

          const previousMessage = index > 0 ? messages[index - 1] : undefined;
          const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined;

          return (
            <ChatMessage
              key={message.id}
              index={index}
              message={message}
              isMyMessage={isMyMessage}
              previousMessage={previousMessage}
              nextMessage={nextMessage}
              setSize={setSize}
            />
          );
        })}

        <Bottom ref={bottomRef} />
      </List>

      {showDownButton && (
        <Fixed>
          <BottomRight>
            <DownButton onClick={() => scrollToBottom(listRef)}>
              <FaChevronDown size="20px" />
            </DownButton>
          </BottomRight>
        </Fixed>
      )}
    </Div>
  );
}

const Div = styled.div`
  height: 100%;
  overflow: auto;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  gap: 8px;
  padding: 16px;
`;

const Bottom = styled.div`
  width: 100%;
  height: 1px;
`;

// 이해 안 가는 부분:
// fixed가 뷰포트 기준이라는데
// 스크롤이되는 부모 엘리먼트 안에 있으면
// 그 부모 엘리먼트를 기준으로 따라간다
const Fixed = styled.div`
  position: fixed;
  width: 100%;
  max-width: 600px;
`;

const BottomRight = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
`;

const DownButton = styled(Button)`
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.circle};
  opacity: 0.5;
`;
