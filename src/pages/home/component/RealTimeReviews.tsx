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
    if (previousPageData && !previousPageData.length) null;
    return `${API_URL}/reviews?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { isLoading, data } = useSWRInfinite(getKey, infiniteFetcher);

  const isEmpty = data?.[0]?.length === 0;
  const isEnd = data && data[data.length - 1]?.length < pageSize;

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

  return (
    <Swiper
      slidesPerView={2}
      centeredSlides={true}
      spaceBetween={20}
      grabCursor={true}
      loop={true}
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
      {data?.map((page) =>
        page?.map((review: any) => (
          <SwiperSlide key={review.id}>
            <ReviewCard review={review} />
          </SwiperSlide>
        )),
      )}
    </Swiper>
  );
}
