import { useState } from 'react';

import styled from 'styled-components';

import { useCustomQuery } from './hooks/useCustomQuery';
import { getFavoritePetsitters } from './api';

import OftenPetsitterCard from './OftenPetsitterCard';
import { Title } from 'commonStyle';

export default function OffenPetsitters() {
  const [page, setPage] = useState<number>(1);

  const { data: petsitterData } = useCustomQuery({ queryFn: () => getFavoritePetsitters({ page, size: 10 }) });

  return (
    <section>
      <Title>내가 자주 이용하는 펫시터</Title>
      <OftenPetsitterContainer>
        {Array.isArray(petsitterData) && petsitterData.length > 0 ? (
          petsitterData.map((petsitter: any) => <OftenPetsitterCard key={petsitter.id} petsitter={petsitter} />)
        ) : (
          <NotLoginPetsitter>펫시터를 찜해보세요!</NotLoginPetsitter>
        )}
      </OftenPetsitterContainer>
    </section>
  );
}

const OftenPetsitterContainer = styled.section`
  display: flex;
  gap: 8px;
`;

const NotLoginPetsitter = styled.div`
  padding: 20px;
`;
