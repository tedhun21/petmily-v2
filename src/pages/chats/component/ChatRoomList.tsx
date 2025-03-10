import { fetcherWithCookie } from 'api';
import styled from 'styled-components';
import useSWRInfinite from 'swr/infinite';
import ChatRoom from './ChatRoom';
import Loading from '@components/Loading';
import { useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { CenterContainer } from 'styles/commonStyle';

const API_URL = process.env.REACT_APP_API_URL;

export default function ChatRoomList() {
  const pageSize = 20;
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref);

  const getKey = (pageIndex: number, previousPageData: any) => {
    const baseKey = `${API_URL}/chats`;
    if (pageIndex === 0 && !previousPageData) {
      return `${baseKey}?pageSize=${pageSize}`;
    }
    if (previousPageData && previousPageData.pagination.hasNextPage) {
      const nextCursor = previousPageData.pagination.nextCursor;
      return `${baseKey}?cursor=${nextCursor}&pageSize=${pageSize}`;
    }
  };

  const { data, isLoading, setSize } = useSWRInfinite(getKey, fetcherWithCookie);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  useEffect(() => {
    if (isInView) {
      setSize((prev) => prev + 1);
    }
  }, [isInView]);

  if (isLoading) {
    return <Loading color="279EFF" />;
  }

  if (isEmpty) {
    return <div>채팅방이 없습니다.</div>;
  }

  return (
    <Main>
      <ul>
        {data?.map((page) => page?.results?.map((chatRoom: any) => <ChatRoom key={chatRoom.id} chatRoom={chatRoom} />))}
      </ul>
      {!isEnd && (
        <CenterContainer ref={ref}>
          <Loading color="#279EFF" />
        </CenterContainer>
      )}
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
`;
