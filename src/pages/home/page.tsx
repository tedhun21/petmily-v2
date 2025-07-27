import styled from 'styled-components';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

import HomeAd from '@components/HomeAd';
// import Footer from '@components/footer/Footer';

import { DefaultLink } from 'styles/commonStyle';
import RealTimeReviews from './component/RealTimeReviews';
import UsedPetsitters from './component/UsedPetsitters';
import NavHeader from '@components/headers/NavHeader';

import { fetcher } from 'api';
import { useAuthSWR } from 'hooks/authSWR';

export default function HomePage() {
  const { data: me } = useAuthSWR('/users/me', fetcher);

  return (
    <>
      <NavHeader />
      <Main>
        <HomeAd />
        <LinkContainer>
          <PetsitterLink to="/faq">자주 묻는 질문</PetsitterLink>
        </LinkContainer>

        <EventContainer>
          <EventSwiper modules={[Pagination]} pagination={{ dynamicBullets: true }}>
            {[
              <SwiperSlide key="1">
                <EventBox>{'첫 만남\n 50% 할인 쿠폰'}</EventBox>
              </SwiperSlide>,
              <SwiperSlide key="2">
                <EventBox>{'첫 만남\n 50% 할인 쿠폰'}</EventBox>
              </SwiperSlide>,
              <SwiperSlide key="3">
                <EventBox>{'첫 만남\n 50% 할인 쿠폰'}</EventBox>
              </SwiperSlide>,
            ]}
          </EventSwiper>
        </EventContainer>

        <AdContainer>
          <AdSwiper modules={[Pagination]} pagination={{ dynamicBullets: true }}>
            {[
              <SwiperSlide key="1">
                <AdBox>
                  <img src="/imgs/HomeTitleAd.svg" alt="Advertising" style={{ width: '100%' }} />
                </AdBox>
              </SwiperSlide>,
              <SwiperSlide key="2">
                <img src="/imgs/HomeTitleAd.svg" alt="Advertising" style={{ width: '100%' }} />
              </SwiperSlide>,
              <SwiperSlide key="3">
                <img src="/imgs/HomeTitleAd.svg" alt="Advertising" style={{ width: '100%' }} />
              </SwiperSlide>,
            ]}
          </AdSwiper>
        </AdContainer>

        {me && <UsedPetsitters />}

        <RealTimeReviews />
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  gap: 20px;
`;

const LinkContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const PetsitterLink = styled(DefaultLink)`
  display: flex;
  justify-content: center;
  padding: 24px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  border-radius: 16px;

  ${({ theme }) => theme.fontSize.s16h24};

  // &:visited {
  //   text-decoration: none;
  // }
`;

const EventContainer = styled.div`
  border-radius: 16px;
`;

const EventBox = styled.div`
  padding: 24px;
`;

const EventSwiper = styled(Swiper)`
  width: 100%;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const AdContainer = styled.div`
  border-radius: 16px;
`;

const AdSwiper = styled(Swiper)`
  width: 100%;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.dp01};
`;

const AdBox = styled.div``;
