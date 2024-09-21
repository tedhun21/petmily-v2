import { Loading } from '@components/Loading';
import { getInfiniteFetcher } from 'api';
import { CenterContainer } from 'commonStyle';
import styled from 'styled-components';
import useSWRInfinite from 'swr/infinite';
import ReviewPhotoCard from './ReviewPhotoCard';

const API_URL = process.env.REACT_APP_API_URL;
export default function PhotoReviews() {
  const pageSize = 20;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/reviews?page=${pageIndex + 1}&pageSize=${pageSize}&photo=true`;
  };

  const { data, isLoading } = useSWRInfinite(getKey, getInfiniteFetcher);

  if (isLoading) {
    return (
      <CenterContainer>
        <Loading color="#279EFF" />
      </CenterContainer>
    );
  }

  return (
    <ReviewContainer>
      {data?.map((page) => page.map((review: any) => <ReviewPhotoCard key={review.id} review={review} />))}
    </ReviewContainer>
  );
}

const ReviewContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: 20px;
`;
