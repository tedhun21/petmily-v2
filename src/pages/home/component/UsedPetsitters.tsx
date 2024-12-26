import useSWRInfinite from 'swr/infinite';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import { CenterContainer, Title } from 'styles/commonStyle';

import { infiniteFetcherWithCookie } from 'api';

import 'swiper/css';
import 'swiper/css/pagination';
import UsedPetsitterCard from './UsedPetsitterCard';
import Loading from '@components/Loading';
import styled from 'styled-components';

const API_URL = process.env.REACT_APP_API_URL;

export default function UsedPetsitters() {
  const pageSize = 12;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) null;
    return `${API_URL}/users/petsitters/used?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { data, isLoading } = useSWRInfinite(getKey, infiniteFetcherWithCookie);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  if (isLoading) {
    <CenterContainer>
      <Loading color="#279EFF" />
    </CenterContainer>;
  }

  if (isEmpty) {
    <span>펫시터를 찜해보세요</span>;
  }

  return (
    <Section>
      <Title>이용한 펫시터 서비스</Title>
      <Swiper
        slidesPerView={2}
        spaceBetween={10}
        pagination={{ dynamicBullets: true }}
        modules={[Pagination]}
        style={{ width: '100%' }}
      >
        {data &&
          data[0]?.results.length > 0 &&
          data.map((page: any) =>
            page?.results.map((petsitter: any) => (
              <SwiperSlide key={petsitter.id}>
                <UsedPetsitterCard petsitter={petsitter} />
              </SwiperSlide>
            )),
          )}
      </Swiper>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
