import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styled from 'styled-components';

import { useAuthSWR, useAuthSWRInfinite } from 'hooks/authSWR';

import { fetcher } from 'api';
import { Title } from 'styles/commonStyle';
import { UserRole } from 'types/user.type';
import UsedPetsitterCard from './UsedPetsitterCard';
import UsedPetsittersSkeleton from './UsedPetsittersSkeleton';

export default function UsedPetsitters() {
  const pageSize = 12;

  const { data: me } = useAuthSWR('/users/me', fetcher);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!me || me.role === UserRole.PETSITTER) return null;
    if (previousPageData && previousPageData.results?.length !== 0) return null;
    return `/reservations/used-petsitters?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { data, isLoading } = useAuthSWRInfinite(getKey, fetcher);

  const isEmpty = !data || data[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  if (!me) return null;

  if (isEmpty) {
    <span>펫시터를 찜해보세요</span>;
  }

  return (
    <Section>
      <Title>이용한 펫시터 서비스</Title>

      {isLoading ? (
        <UsedPetsittersSkeleton />
      ) : (
        <Swiper
          slidesPerView="auto"
          modules={[Pagination]}
          spaceBetween={8}
          pagination={{ dynamicBullets: true }}
          style={{ width: '100%' }}
        >
          {data &&
            data[0]?.results.length > 0 &&
            data.map((page: any) =>
              page?.results?.map((petsitter: any) => (
                <SwiperSlide key={petsitter.id} style={{ width: '220px' }}>
                  <UsedPetsitterCard petsitter={petsitter} />
                </SwiperSlide>
              )),
            )}
        </Swiper>
      )}
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
