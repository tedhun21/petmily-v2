import { useEffect, useRef, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useInView } from 'framer-motion';
import styled from '@emotion/styled';

import { fetcher } from '@/api';
import Flex from '@/components/styled/Flex';
import Loading from '@/components/Loading';
import PhotoReviewCard from './PhotoReviewCard';
import PhotoReviewCardSkeleton from './PhotoReviewCardSkeleton';
import type { Review } from '@/types/review.type';

export default function PhotoReviews() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref);
  const pageSize = 20;

  const getKey = useCallback((pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.results && previousPageData.results.length === 0) return null;

    return `/reviews?page=${pageIndex + 1}&pageSize=${pageSize}&photo=true`;
  }, []);

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(getKey, fetcher);

  // 1. 초기 로딩 중인지 확인 (data가 undefined일 때)
  const isInitialLoading = isLoading && !data;

  // 2. 빈 데이터 확인 (첫 페이지 통신 성공 후 결과가 0개일 때)
  const isEmpty = data && data.length > 0 && data[0]?.results?.length === 0;

  // 3. 끝 확인 (마지막 페이지의 결과 수가 pageSize보다 적을 때)
  // isEmpty일 때도 isEnd는 true가 되어야 하므로 isEmpty를 포함합니다.
  const isEnd = isEmpty || (data && data[data.length - 1]?.results?.length < pageSize);

  // 🔹 4. 다음 페이지를 가져오는 중인지 확인 (초기 로딩이 아닌 상태에서 요청 중)
  const isFetchingMore = isValidating && data && data.length > 0;

  /** 🔹 무한 스크롤 감지 및 다음 페이지 요청 */
  useEffect(() => {
    // 💥 중요: isEnd가 아니며, 유효성 검사 중(요청 중)이 아닐 때만 다음 페이지 요청
    if (isInView && !isEnd && !isValidating && !isInitialLoading) {
      setSize(size + 1);
    }
  }, [isInView, isEnd, isValidating, isInitialLoading, setSize, size]);

  // --- 렌더링 시작 ---

  return (
    <ReviewContainer>
      {/* 🔹 1. 초기 로딩 시 스켈레톤 표시 */}
      {isInitialLoading && Array.from({ length: pageSize }).map((_, i) => <PhotoReviewCardSkeleton key={i} />)}

      {/* 🔹 2. 리뷰 렌더링 */}
      {/* data가 undefined이거나 [undefined]일 때도 안전합니다. */}
      {data?.map((page) => page?.results?.map((review: Review) => <PhotoReviewCard key={review.id} review={review} />))}

      {/* 🔹 3. 빈 상태 표시 (초기 로딩이 끝난 후) */}
      {!isInitialLoading && isEmpty && (
        <Flex justifyContent="center" alignItems="center">
          <span>No Photo Review</span>
        </Flex>
      )}

      {/** 🔹 4. 무한 로딩 표시 및 다음 페이지 트리거 */}
      {/* 끝이 아니고, 비어있지 않고, 초기 로딩 상태가 아닐 때만 표시 */}
      {!isEnd && !isEmpty && !isInitialLoading && (
        <div ref={ref}>
          <Flex justifyContent="center" alignItems="center">
            {/* 다음 페이지 요청 중일 때만 Loading 인디케이터 표시 */}
            {isFetchingMore && <Loading color="#279EFF" />}
            {/* 데이터가 로드된 후 다음 요청을 기다리는 상태에서는 ref만 남김 */}
            {!isFetchingMore && <div style={{ height: '20px' }} />}
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
