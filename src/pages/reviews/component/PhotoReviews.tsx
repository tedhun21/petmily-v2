import { useEffect, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';

import { fetcher } from '@/api';
import Flex from '@/components/styled/Flex';
import Spinner from '@/components/Spinner';
import PhotoReviewCard from './PhotoReviewCard';
import PhotoReviewCardSkeleton from './PhotoReviewCardSkeleton';
import type { Review } from '@/types/review.type';
import type { OffsetResponse } from '@/types/common.type';

const pageSize = 20;

export default function PhotoReviews() {
  const { ref, inView } = useInView();

  const getKey = useCallback((pageIndex: number, previousPageData: OffsetResponse<Review>) => {
    if (previousPageData && previousPageData.results && previousPageData.results.length === 0) return null;

    return `/reviews?page=${pageIndex + 1}&pageSize=${pageSize}&photo=true`;
  }, []);

  const { data, setSize, isLoading, isValidating, error } = useSWRInfinite(getKey, fetcher);

  // 1. 빈 데이터 확인 (첫 페이지 통신 성공 후 결과가 0개일 때)
  const isEmpty = data && data.length > 0 && data[0]?.results?.length === 0;

  const lastPage = data?.[data.length - 1];
  const isEnd = lastPage?.pagination ? lastPage.pagination.page >= lastPage.pagination.totalPages : false;

  useEffect(() => {
    if (inView && !isEnd && !isValidating && !error) {
      setSize((prev) => prev + 1);
    }
  }, [inView, isEnd, isValidating, setSize, error]);

  if (error) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <span>Failed to load reviews.</span>
      </Flex>
    );
  }

  if (isLoading) {
    return Array.from({ length: pageSize }).map((_, i) => <PhotoReviewCardSkeleton key={i} />);
  }

  if (isEmpty) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <span>No Photo Review</span>
      </Flex>
    );
  }

  return (
    <ReviewContainer>
      {data?.map((page) => page?.results?.map((review: Review) => <PhotoReviewCard key={review.id} review={review} />))}

      {!isEnd && (
        <div ref={ref}>
          <Flex justifyContent="center" alignItems="center">
            <Spinner ref={ref} color="#279EFF" />
          </Flex>
        </div>
      )}
    </ReviewContainer>
  );
}

const ReviewContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: ${({ theme }) => theme.space.xl};
`;
