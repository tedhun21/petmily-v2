import { useEffect, useRef } from 'react';

import useSWRInfinite from 'swr/infinite';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import { useInView } from 'framer-motion';

import { Loading } from '@components/Loading';
import { CenterContainer } from 'commonStyle';

import PetmilyCard from './PetmilyCard';
import { infiniteFetcherWithCookie } from 'api';

type Pet = {
  id: number;
  type: 'DOG' | 'CAT';
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  species: string;
  neutering: boolean;
  weight: number;
  body?: string;
  photo?: string;
};

const API_URL = process.env.REACT_APP_API_URL;

export default function MyPetContainer() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const pageSize = 6;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/pets?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, infiniteFetcherWithCookie);

  const isEmpty = data?.[0]?.length === 0;
  const isEnd = data && data[data.length - 1]?.length < pageSize;

  useEffect(() => {
    if (isInView) {
      setSize(size + 1);
    }
  }, [isInView]);

  if (isLoading) {
    return (
      <CenterContainer>
        <Loading color="#279EFF" />
      </CenterContainer>
    );
  }

  if (isEmpty) {
    return (
      <NoPetsContainer>
        <div>등록된 펫밀리가 없습니다.</div>
        <div>프로필을 등록하면 빠른 예약이 가능해요!</div>
        <Link to="/me/register">
          <button>등록하러 가기</button>
        </Link>
      </NoPetsContainer>
    );
  }

  return (
    <CardContainer>
      {data &&
        Array.isArray(data) &&
        data?.map((page: any) => page?.map((pet: any) => <PetmilyCard key={pet.id} pet={pet} />))}

      {!isEnd && (
        <CenterContainer ref={ref}>
          <Loading color="279EFF" />
        </CenterContainer>
      )}
    </CardContainer>
  );
}

const CardContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 12px;
  width: 100%;
`;

// 반려동물이 없을 때
const NoPetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  & > div {
    margin-bottom: 30px;
  }
`;
