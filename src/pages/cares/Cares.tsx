import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Filter from './component/Filter';
import CareContainer from './component/CareContainer';
import { today } from 'utils/date';
import { useSearchParams } from 'react-router-dom';

export default function Cares() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { year, month } = today();

  const filterFromURL = searchParams.get('filter') || 'all';
  const yearFromURL = searchParams.get('year') || year;
  const monthFromURL = searchParams.get('month') || month;

  const [filter, setFilter] = useState({
    id: 1,
    label: '전체',
    value: filterFromURL,
  });

  const [date, setDate] = useState({
    year: yearFromURL,
    month: monthFromURL,
  });

  const handleFilter = (e: any) => {
    setFilter(e);
  };

  useEffect(() => {
    setSearchParams({ filter: filter.value, year: date.year, month: date.month });
  }, [filter, date, setSearchParams]);

  return (
    <MainContainer>
      <Filter filter={filter} handleFilter={handleFilter} date={date} setDate={setDate} />
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
