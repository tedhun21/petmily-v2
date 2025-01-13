import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Filter from './component/Filter';
import CareContainer from './component/CareContainer';

import { useSearchParams } from 'react-router-dom';
import { fetcherWithCookie } from 'api';
import useSWR from 'swr';
import Loading from '@components/Loading';
import { Status } from 'types/reservation.type';

export type FilterType = {
  id: number;
  label: '전체' | '대기' | '예정' | '완료' | '취소';
  value: 'all' | Status;
};

const API_URL = process.env.REACT_APP_API_URL;

export default function Cares() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterFromURL = (searchParams.get('filter') as 'all' | Status) || 'all';
  const dateFromURL = searchParams.get('date');

  const { data: monthData, isLoading: isMonthDataLoading } = useSWR(`${API_URL}/reservations/month`, fetcherWithCookie);

  const [filter, setFilter] = useState<FilterType>({
    id: 1,
    label: '전체',
    value: filterFromURL,
  });

  const [date, setDate] = useState<string | null>(dateFromURL);

  const handleFilter = (e: any) => {
    setFilter(e);
  };

  // month 최신 월로 바꾸기
  useEffect(() => {
    if (monthData && monthData.length > 0) {
      const latestData = monthData[0];
      setDate(latestData);
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set('date', latestData);
        return params;
      });
    }
  }, [monthData]);

  useEffect(() => {
    setSearchParams({ filter: filter.value, date: date || '' });
  }, [filter, date, setSearchParams]);

  if (isMonthDataLoading) {
    return (
      <MainContainer>
        <Loading color="#279EFF" />
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Filter filter={filter} handleFilter={handleFilter} date={date} setDate={setDate} monthData={monthData} />
      <CareContainer />
    </MainContainer>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
`;
