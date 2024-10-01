import { useState } from 'react';

import styled from 'styled-components';

import Filter from './component/Filter';
import Reservations from './component/Reservations';

export default function Care() {
  const [filter, setFilter] = useState({ id: 1, label: '모두', value: 'all' });
  const [order, setOrder] = useState({ id: 1, label: '최신순', value: 'desc' });

  const handleFilter = (e: any) => {
    setFilter(e);
  };

  const handleOrder = (e: any) => {
    setOrder(e);
  };

  return (
    <MainContainer>
      <Filter filter={filter} order={order} handleFilter={handleFilter} handleOrder={handleOrder} />
      <Reservations filter={filter} order={order} />
    </MainContainer>
  );
}

const MainContainer = styled.main`
  position: relative;
  height: 100%;
  padding: 12px;
  background-color: white;
`;
