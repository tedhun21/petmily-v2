import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import useSWRInfinite from 'swr/infinite';
import { io } from 'socket.io-client';

import { IoMdArrowRoundUp } from 'react-icons/io';

import { BlueButton, Input } from 'styles/commonStyle';
import { fetcherWithCookie, posterWithCookie } from 'api';
import { ChatContext } from './ChatRoomProvider';
import { Message } from 'types/message.type';
import { getCookie } from 'utils/cookie';
import ChatContainer from './ChatContainer';
import { MessageContext } from '@components/MessageProvider';

const API_URL = process.env.REACT_APP_API_URL;
const SOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

export default function ChatSection() {
  const pageSize = 30;
  const { opponentIds, socket, chatRoom, setChatRoom } = useContext(ChatContext);
  const { setNewMessages } = useContext(MessageContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<Message>();

  const { register, setValue, handleSubmit } = useForm();

  // getKey는 setSize로 다시 불릴 때, pageIndex = 0 부터 캐시되어 있는 것을 다시 반복해서 부른다.
  // 하지만 pageIndex = 0인 부분은 "최신 데이터를 보장하는 위한 SWR의 기본 전략"이기 때문에 첫번째 페이지는 백엔드에 통신을 보낸다.
  // 그러나 캐시만 사용하고 싶은면   revalidateFirstPage: false => 첫 페이지 재검증 비활성화 옵션을 키는 것이 좋다
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!chatRoom || !chatRoom.id) return null;
    const baseKey = `${API_URL}/chats/${chatRoom.id}/messages`;

    // 첫번째 페이지 호출
    if (pageIndex === 0 && !previousPageData) {
      return `${baseKey}?pageSize=${pageSize}`;
    }

    if (previousPageData && previousPageData.pagination.hasNextPage) {
      const nextCursor = previousPageData.pagination.nextCursor;
      return `${baseKey}?cursor=${nextCursor}&pageSize=${pageSize}`;
    }

    return null;
  };

  // 채팅방 메세지 가져오기
  const { data: messageData, setSize, isLoading } = useSWRInfinite(getKey, fetcherWithCookie);

  // 채팅방 만들기
  const { trigger } = useSWRMutation(opponentIds ? `${API_URL}/chats` : null, posterWithCookie);

  // 채팅방이 없을 때는 메세지를 입력하면 채팅방 만들기
  const onSubmit = async (data: any) => {
    const { message } = data;
    const token = getCookie('access_token');

    // 채팅방에서 첫 메세지 (챗룸이 없고, 웹소켓 연결 안된 상태)
    if ((!chatRoom || !chatRoom.id) && !socket && opponentIds.length > 0) {
      const newChatRoom = await trigger({ formData: { opponentIds } });

      if (newChatRoom && token) {
        // 웹소켓 연결
        const socketConnection = io(`${SOCKET_URL}`, { auth: { token } });

        socketConnection.on('connect', () => {
          socketConnection.emit('joinRoom', newChatRoom.id.toString());

          // 채팅방에 들어가서 첫 메세지 전송
          socketConnection.emit('send', { chatRoomId: newChatRoom.id, message, opponentIds });
        });

        setChatRoom(newChatRoom);
      }
    } else if (chatRoom && socket && opponentIds.length === 0) {
      // 이미 chatRoom 있을 때

      const otherIds = chatRoom.chatMembers?.others?.map((other) => other.id);

      if (otherIds && otherIds.length > 0) {
        socket.emit('send', { chatRoomId: chatRoom.id, message, opponentIds: otherIds });
      }
    }

    setValue('message', null);
  };

  // 메세지 state 업데이트
  useEffect(() => {
    if (messageData) {
      const flat = messageData.flatMap((page) => page.results).reverse();
      setMessages(flat);
    }
  }, [messageData]);

  // 웹소켓 새 메세지 listen
  useEffect(() => {
    if (socket && chatRoom && chatRoom.id) {
      socket.on('chatRoomMessage', (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        setNewMessage(newMessage);
      });

      // 언마운트시 클리어
      return () => {
        socket.off('chatRoomMessage');
      };
    }
  }, [socket, chatRoom]);

  // 새 매세지 초기화 (provider) - 챗룸에 맞는 message만 삭제
  useEffect(() => {
    if (chatRoom && chatRoom.id) {
      setNewMessages((prev) => prev.filter((msg) => msg.chatRoom.id !== chatRoom.id));
    }
  }, [chatRoom]);

  return (
    <Section>
      <ChatContainer
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        isLoading={isLoading}
        setSize={setSize}
      />

      <footer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Wrapper>
            <ChatInput type="text" placeholder="메세지 보내기" {...register('message')} />
            <ChatSubmitButton type="submit">
              <IoMdArrowRoundUp size="28px" color="white" />
            </ChatSubmitButton>
          </Wrapper>
        </form>
      </footer>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  > div {
    flex: auto;
  }

  > footer {
    flex: 1;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 8px;
`;

const ChatInput = styled(Input)`
  flex: auto;
  border-radius: ${({ theme }) => theme.radius.large};
  padding: 8px 12px;
  ${({ theme }) => theme.fontSize.s18h27};
`;

const ChatSubmitButton = styled(BlueButton)`
  border-radius: ${({ theme }) => theme.radius.circle};
  padding: 6px;
`;

// export default function ChatSection() {
//   const pageSize = 30;
//   const { socket, chatRoom, setChatRoom } = useContext(ChatContext);
//   const listRef = useRef<HTMLUListElement>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const isBottomInView = useInView(bottomRef);

//   // const opponent = chatRoom?.client.id === Number(opponentId) ? chatRoom?.petsitter : chatRoom?.client;

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isFirstRender, setIsFirstRender] = useState(true);
//   const [newMessage, setNewMessage] = useState<Message | null>(null);
//   const [showDownButton, setShowDownButton] = useState<boolean>(false);
//   const [newMessageDownButton, setNewMessageDownButton] = useState(false);

//   const { register, handleSubmit, setValue } = useForm();

//   // getKey는 setSize로 다시 불릴 때, pageIndex = 0 부터 캐시되어 있는 것을 다시 반복해서 부른다.
//   // 하지만 pageIndex = 0인 부분은 "최신 데이터를 보장하는 위한 SWR의 기본 전략"이기 때문에 첫번째 페이지는 백엔드에 통신을 보낸다.
//   // 그러나 캐시만 사용하고 싶은면   revalidateFirstPage: false => 첫 페이지 재검증 비활성화 옵션을 키는 것이 좋다
//   const getKey = (pageIndex: number, previousPageData: any) => {
//     if (!chatRoom) return null;

//     const baseKey = `${API_URL}/chats/${chatRoom.id}/messages?opponentId=${opponentId}`;

//     // 첫번째 페이지 호출
//     if (pageIndex === 0 && !previousPageData) {
//       return `${baseKey}&pageSize=${pageSize}`;
//     }

//     if (previousPageData && previousPageData.pagination.hasNextPage) {
//       const nextCursor = previousPageData.pagination.nextCursor;
//       return `${baseKey}&cursor=${nextCursor}&pageSize=${pageSize}`;
//     }

//     return null;
//   };

//   // 채팅방의 메세지 가져오기
//   const { data: messageData, setSize, mutate } = useSWRInfinite(getKey, fetcherWithCookie);

//   // 채팅방 만들기
//   const { trigger } = useSWRMutation(`${API_URL}/chats`, posterWithCookie);

//   const scrollToBottom = (ref: React.RefObject<HTMLElement>) => {
//     if (ref.current) {
//       ref.current.scrollTop = ref.current.scrollHeight;
//     }
//   };

//   const onSubmit = async (data: any) => {
//     const { message } = data;
//     if (!socket || !message.trim()) return;

//     try {
//       // 채팅방이 없으면 채팅방 만들기
//       if (!chatRoom) {
//         // setChatRoom(newChatRoom);
//         // socket.emit('send', { chatRoomId: newChatRoom.id, opponentId, message });
//       } else {
//         // 채팅방이 있으면 메세지 전송
//         // socket.emit('send', { chatRoomId: chatRoom.id, opponentId, message });
//       }
//       // setValue('message', '');
//     } catch (error) {
//       toast.error('메세지 전송 또는 채팅방 생성에 실패했습니다.');
//     }
//   };

//   // 새 메시지를 받으면, mutate로 캐시를 갱신한 후 messages 배열 업데이트
//   useEffect(() => {
//     if (messageData) {
//       const updatedMessages = messageData.flatMap((page) => page.results).reverse();
//       // messages 상태를 강제로 업데이트하는 방법
//       setMessages(updatedMessages); // `setMessages`로 상태를 업데이트
//     }
//   }, [messageData]);

//   // 새 메시지 리슨 (웹소켓)
//   useEffect(() => {
//     if (socket && chatRoom) {
//       socket.on('receive', (newMessage) => {
//         mutate((currentData) => {
//           if (!currentData) return;

//           // 첫 번째 페이지에 새 메시지 추가
//           const updatedPages = currentData.map((page, index) => {
//             if (index === 0) {
//               return {
//                 ...page,
//                 results: [newMessage, ...page.results], // 새 메시지 앞에 추가
//               };
//             }
//             return page; // 다른 페이지는 그대로 반환
//           });

//           return updatedPages;
//         }, false); // 네트워크 요청 없이 캐시만 업데이트

//         setNewMessage(newMessage);
//       });

//       // 언마운트시 클리어
//       return () => {
//         socket.off('receive');
//       };
//     }
//   }, [socket, chatRoom]);

//   // 처음 들어오면 채팅창 제일 밑
//   useEffect(() => {
//     if (listRef.current && messages.length > 0 && isFirstRender) {
//       scrollToBottom(listRef);

//       setIsFirstRender(false);
//     }
//   }, [messages]);

//   // down 버튼 로직이 생기는 로직
//   useEffect(() => {
//     const handleScroll = () => {
//       if (!listRef.current) return;

//       const { scrollTop, scrollHeight, clientHeight } = listRef.current;
//       const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

//       if (scrollPercentage < 99) {
//         setNewMessageDownButton(true);
//       }
//       if (scrollPercentage < 75) {
//         setShowDownButton(true);
//       }

//       if (scrollPercentage >= 100) {
//         setNewMessageDownButton(false);
//         setShowDownButton(false);
//       }
//     };

//     const listElement = listRef.current;
//     listElement?.addEventListener('scroll', handleScroll);

//     return () => {
//       listElement?.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     if (isBottomInView) {
//       setNewMessage(null);
//     }
//   }, [isBottomInView]);

//   // 새 메세지가 들어오고 내 매세지면, 바로 스크롤
//   // 새 매세지가 들어왔는데 isBottomInView가 true면 밑으로 스크롤
//   useEffect(() => {
//     if ((newMessage && newMessage.sender.id !== Number(opponentId)) || isBottomInView) {
//       bottomRef.current?.scrollIntoView({ behavior: 'auto' });
//     }
//   }, [newMessage]);

//   return (
//     <Section>
//       <Div>
//         {/* <List ref={listRef}>
//           {messages?.map((message: Message, index: number) => {
//             const isMyMessage = message.sender.id !== Number(opponentId);

//             const previousMessage = index > 0 ? messages[index - 1] : undefined;
//             const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined;

//             return (
//               <ChatMessage
//                 key={message.id}
//                 index={index}
//                 message={message}
//                 isMyMessage={isMyMessage}
//                 previousMessage={previousMessage}
//                 nextMessage={nextMessage}
//                 setSize={setSize}
//               />
//             );
//           })}

//           <Bottom ref={bottomRef} />
//         </List> */}

//         {/* {newMessageDownButton && newMessage && newMessage.sender.id === Number(opponentId) && opponent && (
//           <Fixed>
//             <FixedBottom>
//               <BottomDiv>
//                 <NewMessageDownButton onClick={() => scrollToBottom(listRef)}>
//                   <NewMessageOpponent>
//                     <OpponentPhoto>
//                       <ImageCentered src={`${opponent.photo ? opponent.photo : '/imgs/DefaultUserProfile.jpg'}`} />
//                     </OpponentPhoto>
//                     <span>{opponent.nickname}</span>
//                     <Texts14h21>{newMessage.content}</Texts14h21>
//                   </NewMessageOpponent>
//                   <div style={{ flex: 1 }}>
//                     <FaChevronDown />
//                   </div>
//                 </NewMessageDownButton>
//               </BottomDiv>
//             </FixedBottom>
//           </Fixed>
//         )} */}

//         {/* {showDownButton && !newMessage && (
//           <Fixed>
//             <BottomRight>
//               <DownButton onClick={() => scrollToBottom(listRef)}>
//                 <FaChevronDown size="20px" />
//               </DownButton>
//             </BottomRight>
//           </Fixed>
//         )} */}
//       </Div>

//       <footer>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Wrapper>
//             <ChatInput type="text" placeholder="메세지 보내기" {...register('message')} />
//             <ChatSubmitButton type="submit">
//               <IoMdArrowRoundUp size="28px" color="white" />
//             </ChatSubmitButton>
//           </Wrapper>
//         </form>
//       </footer>
//     </Section>
//   );
// }

// const Section = styled.section`
//   display: flex;
//   flex-direction: column;
//   overflow: hidden;
//   height: 100%;

//   > div {
//     flex: auto;
//     overflow: auto;
//   }

//   > footer {
//     flex: 1;
//   }
// `;

// const Div = styled.div`
//   height: 100%;
//   overflow: auto;
// `;

// const List = styled.ul`
//   display: flex;
//   flex-direction: column;
//   overflow-y: auto;
//   height: 100%;
//   gap: 8px;
//   padding: 16px;
// `;

// const Bottom = styled.div`
//   width: 100%;
//   height: 1px;
// `;

// // 이해 안 가는 부분:
// // fixed가 뷰포트 기준이라는데
// // 스크롤이되는 부모 엘리먼트 안에 있으면
// // 그 부모 엘리먼트를 기준으로 따라간다
// const Fixed = styled.div`
//   position: fixed;
//   width: 100%;
//   max-width: 600px;
// `;

// const FixedBottom = styled.div`
//   position: absolute;
//   bottom: 8px;
//   width: 100%;
// `;

// const BottomRight = styled.div`
//   position: absolute;
//   right: 8px;
//   bottom: 8px;
// `;

// const BottomDiv = styled.div`
//   display: flex;
//   width: 100%;
//   padding: 12px;
// `;

// const NewMessageDownButton = styled(Button)`
//   display: flex;
//   width: 100%;
//   border-radius: ${({ theme }) => theme.radius.large};
//   background-color: ${({ theme }) => theme.background.box.default.primary};
//   padding: 8px;
// `;

// const NewMessageOpponent = styled(Row)`
//   flex: auto;
//   width: 100%;
//   align-items: center;
//   gap: 8px;
// `;

// const OpponentPhoto = styled(RoundedImageWrapper)`
//   width: 32px;
//   height: 32px;
// `;

// const DownButton = styled(Button)`
//   padding: 16px;
//   border-radius: ${({ theme }) => theme.radius.circle};
//   opacity: 0.7;
// `;
