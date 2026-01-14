import { useEffect } from 'react';

import styled from '@emotion/styled';
import { useInView } from 'react-intersection-observer';
import { useAuthSWRInfinite } from '@/hooks/authSWR';

import { fetcher } from '@/api';
import Spinner from '@/components/Spinner';
import Flex from '@/components/styled/Flex';

const PAGE_SIZE = 10;

export default function MySchedule() {
  const { ref, inView } = useInView();

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.results.length) return null;
    return `/reservations?page=${pageIndex + 1}&pageSize=${PAGE_SIZE}`;
  };

  const { data, size, setSize, isLoading } = useAuthSWRInfinite(getKey, fetcher);

  const isEmpty = data?.[0]?.length === 0;

  const lastPage = data?.[data.length - 1];
  const isEnd = lastPage?.pagination ? lastPage.pagination.page >= lastPage.pagination.totalPages : false;

  useEffect(() => {
    if (inView) {
      setSize(size + 1);
    }
  }, [inView, setSize]);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Spinner color="#279EFF" />
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
            <Spinner color="#279EFF" />
          </Flex>
        </div>
      )}
    </ScheduleList>
  );
}

const ScheduleList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
`;
