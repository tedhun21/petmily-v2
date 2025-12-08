import { useEffect, useRef } from 'react';

import styled from '@emotion/styled';
import { useInView } from 'framer-motion';

import { useAuthSWRInfinite } from '@/hooks/authSWR';
import PetmilyCard from './PetmilyCard';
import { fetcher } from '@/api';
import Loading from '@/components/Loading';
import type { Pet } from '@/types/pet.type';
import Flex from '@/components/styled/Flex';
import Link from '@/components/styled/Link';

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
      <Flex justifyContent="center" alignItems="center">
        <Loading color="#279EFF" />
      </Flex>
    );
  }

  if (isEmpty) {
    return (
      <Flex direction="column" alignItems="center">
        <span>등록된 펫밀리가 없습니다.</span>
        <span>프로필을 등록하면 빠른 예약이 가능해요!</span>
        <Link to="/me/register" type="text">
          등록하러 가기
        </Link>
      </Flex>
    );
  }

  return (
    <CardContainer>
      {data &&
        Array.isArray(data) &&
        data?.map((page: any) => page?.results.map((pet: Pet) => <PetmilyCard key={pet.id} pet={pet} />))}

      {!isEnd && (
        <div ref={ref}>
          <Flex justifyContent="center" alignItems="center">
            <Loading color="#279EFF" />
          </Flex>
        </div>
      )}
    </CardContainer>
  );
}

const CardContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${({ theme }) => theme.space.md};
  width: 100%;
`;
