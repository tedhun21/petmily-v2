import { useEffect, useRef } from 'react';

import styled from 'styled-components';
import useSWRInfinite from 'swr/infinite';
import { useInView } from 'framer-motion';

import { CenterContainer } from 'styles/commonStyle';
import { infiniteFetcherWithCookie } from 'api';

import Loading from '@components/Loading';
import CareCard from './CareCard';
import { getCookie } from 'utils/cookie';
import { useSearchParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function CareContainer() {
  const [searchParams] = useSearchParams();
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  const filter = searchParams.get('filter');

  const ref = useRef(null);
  const isInView = useInView(ref);
  const pageSize = 10;

  const getKey = (pageIndex: number, previousPageData: any) => {
    const access_token = getCookie('access_token');
    if (!access_token) return null;

    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/reservations?page=${pageIndex + 1}&pageSize=${pageSize}&status=${filter}&date=${year}-${month}`;
  };
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, infiniteFetcherWithCookie);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  useEffect(() => {
    if (isInView) {
      setSize(size + 1);
    }
  }, [isInView]);

  if (isLoading) {
    return (
      <CenterContainer style={{ height: '100%' }}>
        <Loading color="#279EFF" />
      </CenterContainer>
    );
  }

  if (isEmpty) {
    return (
      <CenterContainer style={{ height: '100%' }}>
        <span>No Reservation</span>
      </CenterContainer>
    );
  }

  return (
    <CareCardContainer>
      {data &&
        data[0]?.results.length > 0 &&
        data?.map((page: any) =>
          page?.results.map((reservation: any) => <CareCard key={reservation.id} reservation={reservation} />),
        )}

      {data && !isEnd && (
        <CenterContainer ref={ref}>
          <Loading color="#279EFF" />
        </CenterContainer>
      )}
    </CareCardContainer>
  );
}

const CareCardContainer = styled.div`
  flex: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  gap: 16px;
`;
