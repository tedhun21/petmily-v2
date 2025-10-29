import styled from 'styled-components';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const events = ['첫 만남\n 50% 할인 쿠폰', '내 반려동물 자랑대회', '펫 친구 초대 이벤트'];

export default function EventSwiper() {
  const delay = 3000 / events.length;
  return (
    <CustomSwiper modules={[Pagination]} pagination={{ dynamicBullets: true, clickable: true }} autoplay={{ delay }}>
      {events.map((event, index) => (
        <SwiperSlide key={index}>
          <EventCard>{event}</EventCard>
        </SwiperSlide>
      ))}
    </CustomSwiper>
  );
}

const CustomSwiper = styled(Swiper)`
  width: 100%;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const EventCard = styled.div`
  padding: 24px;
  height: 100px;
`;
