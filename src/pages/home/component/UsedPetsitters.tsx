import useSWRInfinite from 'swr/infinite';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import { CenterContainer } from 'commonStyle';
import { Loading } from '@components/Loading';

import { infiniteFetcherWithCookie } from 'api';

import 'swiper/css';
import 'swiper/css/pagination';
import UsedPetsitterCard from './UsedPetsitterCard';

const API_URL = process.env.REACT_APP_API_URL;

export default function UsedPetsitters() {
  const pageSize = 12;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) null;
    return `${API_URL}/users/petsitters/used?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { data, isLoading } = useSWRInfinite(getKey, infiniteFetcherWithCookie);

  const isEmpty = data?.[0]?.length === 0;
  const isEnd = data && data[data.length - 1]?.length < pageSize;

  if (isLoading) {
    <CenterContainer>
      <Loading color="#279EFF" />
    </CenterContainer>;
  }

  if (isEmpty) {
    <span>펫시터를 찜해보세요</span>;
  }

  return (
    <Swiper slidesPerView={2} spaceBetween={10} pagination={{ dynamicBullets: true }} modules={[Pagination]}>
      {data &&
        data.map((page: any) =>
          page?.map((petsitter: any) => (
            <SwiperSlide key={petsitter.id}>
              <UsedPetsitterCard petsitter={petsitter} />
            </SwiperSlide>
          )),
        )}
    </Swiper>
  );
}
