import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { IUser } from 'store/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CareCard from '@components/Carecard';

import { useInView } from 'react-intersection-observer';
import jwt_decode from 'jwt-decode';

import { CircularProgress } from '@mui/material';
import { getCookie } from 'utils/cookie';
import { motion, useAnimation, useScroll } from 'framer-motion';
import Filter from './component/Filter';

import { getReservations } from './api';

const API_URL = process.env.REACT_APP_API_URL;

export default function Care() {
  const navigate = useNavigate();

  const { ref, inView } = useInView();

  const [filter, setFilter] = useState({ id: 1, label: '모두', value: 'all' });

  const [isEnd, setIsEnd] = useState(false);

  const handleFilter = (e: any) => {
    setFilter(e);
  };

  return (
    <MainContainer>
      <Filter filter={filter} handleFilter={handleFilter} />
      <CareCardContainer>
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
