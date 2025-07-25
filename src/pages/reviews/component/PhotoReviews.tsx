import { useEffect, useRef } from 'react';

import useSWRInfinite from 'swr/infinite';
import { useInView } from 'framer-motion';

import { fetcher } from 'api';
import { CenterContainer } from 'styles/commonStyle';
import styled from 'styled-components';
import ReviewPhotoCard from './ReviewPhotoCard';
import Loading from '@components/Loading';

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

  if (isLoading) {
    return (
      <CenterContainer>
        <Loading color="#279EFF" />
      </CenterContainer>
    );
  }

  if (isEmpty) {
    return (
      <CenterContainer>
        <span>No Photo Review</span>
      </CenterContainer>
    );
  }

  return (
    <ReviewContainer>
      {data &&
        data[0]?.results.length > 0 &&
        data?.map((page) => page?.results.map((review: any) => <ReviewPhotoCard key={review.id} review={review} />))}

      {data && !isEnd && (
        <CenterContainer ref={ref}>
          <Loading color="#279EFF" />
        </CenterContainer>
      )}
    </ReviewContainer>
  );
}

const ReviewContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: 20px;
`;
