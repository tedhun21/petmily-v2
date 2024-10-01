import { useEffect, useRef } from 'react';

import styled from 'styled-components';
import useSWRInfinite from 'swr/infinite';
import { useInView } from 'framer-motion';

import CareCard from './Carecard';
import { Loading } from '@components/Loading';
import { CenterContainer } from 'commonStyle';
import { infiniteFetcherWithCookie } from 'api';

const API_URL = process.env.REACT_APP_API_URL;
export default function Reservations({ filter, order }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const pageSize = 10;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/reservations?page=${pageIndex + 1}&pageSize=${pageSize}&status=${filter.value}&order=${order.value}`;
  };
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, infiniteFetcherWithCookie);

  const isEmpty = data?.[0]?.length === 0;
  const isEnd = data && data[data.length - 1]?.length < pageSize;

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
        <span>No Reservation</span>
      </CenterContainer>
    );
  }

  return (
    <CareCardContainer>
      {data &&
        Array.isArray(data) &&
        data?.map((page: any) =>
          page?.map((reservation: any) => <CareCard key={reservation.id} reservation={reservation} />),
        )}

      {!isEnd && (
        <CenterContainer ref={ref}>
          <Loading color="279EFF" />
        </CenterContainer>
      )}
    </CareCardContainer>
  );
}

const CareCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  gap: 16px;
`;
