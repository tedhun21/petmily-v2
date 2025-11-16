import { useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';
import { useAuthSWRInfinite } from 'hooks/authSWR';
import { useInView } from 'framer-motion';

import { fetcher } from 'api';

import Loading from '@components/Loading';
import CareCard from './CareCard';
import { RootState } from 'store';
import { flex, Flex } from '@components/Flex';
import Box from '@components/Box';
import styled from 'styled-components';

export default function CareContainer() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const pageSize = 10;

  const {
    reservation: { month, filter },
  } = useSelector((state: RootState) => state.context);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return filter && month
      ? `/reservations?page=${pageIndex + 1}&pageSize=${pageSize}&status=${filter}&date=${month}`
      : null;
  };
  const { data, size, setSize, isLoading } = useAuthSWRInfinite(getKey, fetcher);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  useEffect(() => {
    if (isInView) {
      setSize(size + 1);
    }
  }, [isInView]);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" style={{ height: '100%' }}>
        <Loading color="#279EFF" />
      </Flex>
    );
  }

  if (isEmpty) {
    return (
      <Flex justifyContent="center" alignItems="center" style={{ height: '100%' }}>
        <span>No Reservation</span>
      </Flex>
    );
  }

  return (
    <Container>
      {data &&
        data[0]?.results.length > 0 &&
        data?.map((page: any) =>
          page?.results.map((reservation: any) => <CareCard key={reservation.id} reservation={reservation} />),
        )}

      {data && !isEnd && (
        <div ref={ref}>
          <Flex justifyContent="center" alignItems="center">
            <Loading color="#279EFF" />
          </Flex>
        </div>
      )}
    </Container>
  );
}

const Container = styled(Box).attrs(() => ({
  h: '100%',
}))`
  ${flex({
    direction: 'column',
    gap: 'lg',
  })}
`;
