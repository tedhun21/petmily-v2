import { useEffect, useRef } from 'react';

import useSWRInfinite from 'swr/infinite';
import { useInView } from 'framer-motion';

import { fetcher } from 'api';
import styled from 'styled-components';
import Loading from '@components/Loading';
import PhotoReviewCardSkeleton from './PhotoReviewCardSkeleton';
import PhotoReviewCard from './PhotoReviewCard';
import { Flex } from '@components/Flex';

export default function PhotoReviews() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const pageSize = 20;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/reviews?page=${pageIndex + 1}&pageSize=${pageSize}&photo=true`;
  };

  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  useEffect(() => {
    if (isInView) {
      setSize(size + 1);
    }
  }, [isInView]);

  if (isEmpty) {
    return (
      <Flex justifyContent="center" alignItems="center">
        <span>No Photo Review</span>
      </Flex>
    );
  }

  return (
    <ReviewContainer>
      {isLoading && Array.from({ length: 20 }).map((_, index) => <PhotoReviewCardSkeleton key={index} />)}

      {data &&
        data[0]?.results.length > 0 &&
        data?.map((page) => page?.results.map((review: any) => <PhotoReviewCard key={review.id} review={review} />))}

      {data && !isEnd && (
        <div ref={ref}>
          <Flex justifyContent="center" alignItems="center">
            <Loading color="#279EFF" />
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
  padding: ${({ theme }) => theme.spacing.xl};
`;
