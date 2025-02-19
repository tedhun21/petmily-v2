import styled from 'styled-components';

import useSWRInfinite from 'swr/infinite';
import { CenterContainer } from 'styles/commonStyle';

const API_URL = process.env.REACT_APP_API_URL;
import { fetcherWithCookie } from 'api';
import Loading from '@components/Loading';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export default function MySchedule() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const pageSize = 10;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/reservations?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcherWithCookie);

  const isEmpty = data?.[0]?.length === 0;
  const isEnd = data && data[data.length - 1]?.results.length < pageSize;

  useEffect(() => {
    if (isInView) {
      setSize(size + 1);
    }
  }, [isInView]);

  if (isLoading) {
    return (
      <CenterContainer>
        <Loading color="#279EFF" />
      </CenterContainer>
    );
  }

  if (isEmpty) {
    return (
      <CenterContainer>
        <span>No Schedule</span>
      </CenterContainer>
    );
  }

  return (
    <ScheduleList>
      {data &&
        data[0]?.results.length > 0 &&
        data?.map((page) => page?.results.map((schedule: any) => <div key={schedule.id}>{schedule.id}</div>))}

      {!isEnd && (
        <CenterContainer ref={ref}>
          <Loading color="#279EFF" />
        </CenterContainer>
      )}
    </ScheduleList>
  );
}

const ScheduleList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
