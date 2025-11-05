import { useEffect, useRef } from 'react';

import { Link } from 'react-router-dom';

import styled from 'styled-components';
import { useInView } from 'framer-motion';

import { Center, Column } from 'styles/commonStyle';

import { useAuthSWRInfinite } from 'hooks/authSWR';
import PetmilyCard from './PetmilyCard';
import { fetcher } from 'api';
import Loading from '@components/Loading';
import { Pet } from 'types/pet.type';

export default function MyPetContainer() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const pageSize = 6;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/pets?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { data, size, setSize, isLoading } = useAuthSWRInfinite(getKey, fetcher);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  useEffect(() => {
    if (isInView) {
      setSize(size + 1);
    }
  }, [isInView]);

  if (isLoading) {
    return (
      <Center>
        <Loading color="#279EFF" />
      </Center>
    );
  }

  if (isEmpty) {
    return (
      <NoPetsContainer>
        <div>등록된 펫밀리가 없습니다.</div>
        <div>프로필을 등록하면 빠른 예약이 가능해요!</div>
        <StyledLink to="/me/register">등록하러 가기</StyledLink>
      </NoPetsContainer>
    );
  }

  return (
    <CardContainer>
      {data &&
        Array.isArray(data) &&
        data?.map((page: any) => page?.results.map((pet: Pet) => <PetmilyCard key={pet.id} pet={pet} />))}

      {!isEnd && (
        <Center ref={ref}>
          <Loading color="#279EFF" />
        </Center>
      )}
    </CardContainer>
  );
}

const CardContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

// 반려동물이 없을 때
const NoPetsContainer = styled(Column)`
  align-items: center;
  text-align: center;

  & > div {
    margin-bottom: 30px;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.box.accent.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text.white};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.accent.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.box.accent.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }

  > span {
    color: inherit;
  }
`;
