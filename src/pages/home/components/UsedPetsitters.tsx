import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { useAuthSWR } from '@/hooks/authSWR';

import { fetcher } from '@/api';
import { Title } from '@/styles/commonStyle';
import type { Petsitter } from '@/types/user.type';
import UsedPetsitterCard from './UsedPetsitterCard';
import UsedPetsittersSkeleton from './UsedPetsittersSkeleton';
import type { OffsetResponse } from '@/types/common.type';

export default function UsedPetsitters() {
  const pageSize = 12;

  const { data: me } = useAuthSWR('/users/me', fetcher);

  const { data, isLoading } = useAuthSWR(`/reservations/used-petsitters?page=1&pageSize=${pageSize}`, fetcher);

  if (!me) return null;

  return (
    <section>
      {isLoading ? (
        <UsedPetsittersSkeleton />
      ) : (
        <>
          <Title>이용한 펫시터 서비스</Title>
          <Swiper
            slidesPerView="auto"
            modules={[Pagination]}
            spaceBetween={8}
            pagination={{ dynamicBullets: true }}
            style={{ width: '100%' }}
          >
            {data &&
              data[0]?.results.length > 0 &&
              data.map((page: OffsetResponse<Petsitter>) =>
                page?.results?.map((petsitter: Petsitter) => (
                  <SwiperSlide key={petsitter.id} style={{ width: '220px' }}>
                    <UsedPetsitterCard petsitter={petsitter} />
                  </SwiperSlide>
                )),
              )}
          </Swiper>
        </>
      )}
    </section>
  );
}
