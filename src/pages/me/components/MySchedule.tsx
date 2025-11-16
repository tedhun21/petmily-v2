import { useEffect, useRef } from 'react';

import styled from 'styled-components';
import { useInView } from 'framer-motion';
import { useAuthSWRInfinite } from 'hooks/authSWR';

import { fetcher } from 'api';
import Loading from '@components/Loading';
import { Flex } from '@components/Flex';

export default function MySchedule() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const pageSize = 10;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/reservations?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { data, size, setSize, isLoading } = useAuthSWRInfinite(getKey, fetcher);

  const isEmpty = data?.[0]?.length === 0;
  const isEnd = data && data[data.length - 1]?.results.length < pageSize;

  useEffect(() => {
    if (isInView) {
      setSize(size + 1);
    }
  }, [isInView]);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Loading color="#279EFF" />
      </Flex>
    );
  }

  if (isEmpty) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <span>No Schedule</span>
      </Flex>
    );
  }

  return (
    <ScheduleList>
      {data &&
        data[0]?.results.length > 0 &&
        data?.map((page) => page?.results.map((schedule: any) => <div key={schedule.id}>{schedule.id}</div>))}

      {!isEnd && (
        <div ref={ref}>
          <Flex justifyContent="center" alignItems="center">
            <Loading color="#279EFF" />
          </Flex>
        </div>
      )}
    </ScheduleList>
  );
}

const ScheduleList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;
