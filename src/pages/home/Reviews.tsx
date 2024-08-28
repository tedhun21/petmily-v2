import styled from 'styled-components';
import { useState } from 'react';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Rating from '@mui/material/Rating';
import { useInView } from 'react-intersection-observer';
import { CircularProgress } from '@mui/material';
import { useCustomQuery } from './hooks/useCustomQuery';
import { getReviewsWithPhoto } from './api';
import { Title } from 'commonStyle';
import ReviewPhotoCard from './ReviewPhotoCard';

const bucketUrl = process.env.REACT_APP_BUCKET_URL;

//   <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
const userDefaultImage = '/imgs/DefaultUser.svg';

export default function Reviews() {
  const [page, setPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);

  const { ref, inView } = useInView();

  const { data } = useCustomQuery({ queryFn: () => getReviewsWithPhoto({ photo: true, page, size: 10 }) });

  // ref로 연결된 엘리먼트가 보일때마다 이 useEffect를 실행한다.
  // 한 페이지 응답이 끝날때 마다 page + 1
  // 서버에서 응답 받은 totalPages와 page의 수가 같을 때 통신이 중단  => isEnd = true
  // useEffect(() => {
  //   if (inView) {
  //     const fetchReview = async () => {
  //       try {
  //         const response = await axios.get(`${apiUrl}/reviews?page=${page}&size=8`);

  //         if (response.data && response.data.reviews) {
  //           setReviews((prev) => [...prev, ...response.data.reviews]);
  //           setPage((page) => page + 1);

  //           // if (response.data.pageInfo.totalPages === page || response.data.pageInfo.totalPages === 0) {
  //           //   setIsEnd(true);
  //           // }
  //         }
  //       } catch (error) {
  //         console.error(error);
  //         if (error) {
  //           setIsEnd(true);
  //         }
  //       }
  //     };
  //     fetchReview();
  //   }
  // }, [inView]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <ReviewSection>
      <Title>펫밀리 이용 후기</Title>

      <ReviewContainer>
        {Array.isArray(data?.results) &&
          data?.results.length > 0 &&
          data?.results.map((review: any) => <ReviewPhotoCard key={review.id} review={review} />)}
      </ReviewContainer>

      {/* {!isEnd ? (
        <LoadingContainer ref={ref}>
          <CircularProgress />
        </LoadingContainer>
      ) : null} */}
    </ReviewSection>
  );
}

const ReviewSection = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
`;

const ReviewContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0px;
`;
