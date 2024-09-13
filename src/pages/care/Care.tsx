import { useState } from 'react';

import styled from 'styled-components';

import Filter from './component/Filter';
import Reservations from './component/Reservations';

export default function Care() {
  const [filter, setFilter] = useState({ id: 1, label: '모두', value: 'all' });

  const handleFilter = (e: any) => {
    setFilter(e);
  };

  return (
    <MainContainer>
      <Filter filter={filter} handleFilter={handleFilter} />
      <Reservations filter={filter} />
    </MainContainer>
  );
}

const MainContainer = styled.main`
  position: relative;
  height: 100%;
  padding: 12px;
  background-color: white;
`;
