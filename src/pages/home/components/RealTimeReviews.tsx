import useSWR from 'swr';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { fetcher } from '@/api';
import ReviewCard from './ReviewCard';
import { Title } from '@/styles/commonStyle';
import type { Review } from '@/types/review.type';
import RealTimeReviewsSkeleton from './RealTimeReviewsSkeleton';

export default function RealTimeReviews() {
  const pageSize = 10;

  const { isLoading, data } = useSWR(`/reviews?page=1&pageSize=${pageSize}`, fetcher);

  return (
    <section>
      <Title>실시간 후기</Title>

      {isLoading ? (
        <RealTimeReviewsSkeleton />
      ) : (
        <Swiper
          slidesPerView="auto"
          centeredSlides={true}
          spaceBetween={16}
          grabCursor={true}
          loop={false}
          pagination={{
            dynamicBullets: true,
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          style={{ width: '100%' }}
        >
          {data &&
            data?.results.length > 0 &&
            data?.results.map((review: Review) => (
              <SwiperSlide key={review.id} style={{ width: '300px' }}>
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </section>
  );
}
