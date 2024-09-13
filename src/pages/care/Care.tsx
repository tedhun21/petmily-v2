import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

import CareCard from '@pages/care/component/Carecard';

import { useInView } from 'react-intersection-observer';

import { CircularProgress } from '@mui/material';

import Filter from './component/Filter';

import { getReservations } from './api';

import useSWRInfinite from 'swr/infinite';
import { Loading } from '@components/Loading';

const API_URL = process.env.REACT_APP_API_URL;

export default function Care() {
  const { ref, inView } = useInView();

  const [filter, setFilter] = useState({ id: 1, label: '모두', value: 'all' });

  const [isEnd, setIsEnd] = useState(false);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/reservations?page=${pageIndex + 1}&pageSize=20&status=${filter.value}`;
  };
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, getReservations);

  // console.log(data);

  const handleFilter = (e: any) => {
    setFilter(e);
  };

  return (
    <MainContainer>
      <Filter filter={filter} handleFilter={handleFilter} />
      <CareCardContainer>
        {data && Array.isArray(data) && data[0]?.length > 0 ? (
          data?.map((page: any) =>
            page.map((reservation: any) => <CareCard key={reservation.id} reservation={reservation} />),
          )
        ) : isLoading ? (
          <Loading size="40px" />
        ) : (
          <span>No Reservation</span>
        )}
        {/* {data?.pages.map((page) =>
          page.map((reservation: any) => <CareCard key={reservation.id} reservation={reservation} />),
        )} */}
        {/* {Array.isArray(reservations) && reservations.length > 0 ? (
          reservations.map((reservation) => <CareCard key={reservation.reservationId} reservation={reservation} />)
        ) : !isEnd ? null : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>등록된 예약이 없습니다.</div>
          </div>
        )} */}
        {/* {!isEnd ? (
            <LoadingContainer ref={ref}>
              <CircularProgress />
            </LoadingContainer>
          ) : null} */}
        <button onClick={() => setSize(size + 1)}>Load More</button>
      </CareCardContainer>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  position: relative;
  height: 100%;
  padding: 12px;
  background-color: white;
`;

const CareContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const CareCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  gap: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
`;
