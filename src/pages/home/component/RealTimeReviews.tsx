import useSWRInfinite from 'swr/infinite';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { CenterContainer } from 'commonStyle';

import ReviewCard from './ReviewCard';
import { infiniteFetcher } from 'api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Loading from '@components/Loading';

const API_URL = process.env.REACT_APP_API_URL;
export default function RealTimeReviews() {
  const pageSize = 10;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.results.length) return null; // Stop when no more results
    return `${API_URL}/reviews?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { isLoading, data } = useSWRInfinite(getKey, infiniteFetcher);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

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
        <span>조건에 맞는 펫시터가 없습니다</span>
      </CenterContainer>
    );
  }

  console.log(data);

  return (
    <Swiper
      slidesPerView={2}
      centeredSlides={true}
      spaceBetween={20}
      grabCursor={true}
      loop={!isEnd} // Enable loop if there are more reviews to load
      pagination={{
        dynamicBullets: true,
        clickable: true,
      }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[Autoplay, Pagination, Navigation]}
    >
      {data &&
        data[0]?.results.length > 0 &&
        data?.map((page: any) =>
          page?.results.map((review: any) => (
            <SwiperSlide key={review.id}>
              <ReviewCard review={review} />
            </SwiperSlide>
          )),
        )}
    </Swiper>
  );
}
