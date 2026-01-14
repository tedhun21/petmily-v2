import { useEffect } from 'react';

import styled from '@emotion/styled';
import { useInView } from 'react-intersection-observer';

import { useAuthSWRInfinite } from '@/hooks/authSWR';
import PetmilyCard from './PetmilyCard';
import { fetcher } from '@/api';
import Spinner from '@/components/Spinner';
import type { Pet } from '@/types/pet.type';
import Flex from '@/components/styled/Flex';
import Link from '@/components/styled/Link';
import Box from '@/components/styled/Box';
import { pulse } from '@/styles/commonStyle';

const pageSize = 3;

export default function MyPetContainer() {
  const { ref, inView } = useInView();

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.results.length) return null;
    return `/pets?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { data, setSize, isLoading, isValidating } = useAuthSWRInfinite(getKey, fetcher);

  const isEmpty = data?.[0]?.results?.length === 0;

  const lastPage = data?.[data.length - 1];
  const isEnd = lastPage?.pagination ? lastPage.pagination.page >= lastPage.pagination.totalPages : false;

  useEffect(() => {
    if (inView && !isEnd && !isValidating) {
      setSize((prev) => prev + 1);
    }
  }, [inView, setSize, isEnd, isValidating]);

  if (isLoading) {
    return (
      <CardContainer>
        {Array.from({ length: pageSize }).map((_, index) => (
          <PetmilyCardSkeleton key={index} />
        ))}
      </CardContainer>
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
        <Flex ref={ref} justifyContent="center" alignItems="center">
          <Spinner color="#279EFF" />
        </Flex>
      )}
    </CardContainer>
  );
}

const PetmilyCardSkeleton = () => (
  <PetmilyCardSkeletonContainer p="md" br="md">
    <Flex direction="column" gap="lg">
      <SkeletonElement style={{ height: '100%', width: '100%', aspectRatio: 1, borderRadius: '8px' }} />
      <SkeletonElement style={{ height: '1.5rem', width: '50%' }} />
      <SkeletonElement style={{ height: '1.25rem', width: '80%' }} />
    </Flex>
  </PetmilyCardSkeletonContainer>
);

const CardContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${({ theme }) => theme.space.md};
  width: 100%;
`;

const PetmilyCardSkeletonContainer = styled(Box)`
  border: 2px solid ${({ theme }) => theme.colors.background.box.default.hover};
`;

const SkeletonElement = styled.div`
  background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  border-radius: ${({ theme }) => theme.radius.md};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;
