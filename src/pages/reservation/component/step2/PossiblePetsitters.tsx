import styled from 'styled-components';
import useSWRInfinite from 'swr/infinite';

import { CenterContainer, Column } from 'commonStyle';
import { useFormContext } from 'react-hook-form';
import { getInfiniteFetcher } from 'api';
import { Loading } from '@components/Loading';
import PetsitterCard from './PetsitterCard';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import dayjs from 'dayjs';

const API_URL = process.env.REACT_APP_API_URL;

export default function PossiblePetsitters({ onNext }: any) {
  const { getValues } = useFormContext();
  const { date, startTime, endTime, address, petType } = getValues();

  const ref = useRef(null);
  const isInView = useInView(ref);

  const pageSize = 20;

  const getKey = (pageIndex: number, previousPageData: any) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const formattedStartTime = dayjs(startTime).format('HH:mm:ss');
    const formattedEndTime = dayjs(endTime).format('HH:mm:ss');
    const formattedAddress = address.split(' ').slice(1, 2);

    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/user/possiblePetsitter?date=${formattedDate}&startTime=${formattedStartTime}&endTime=${formattedEndTime}&address=${formattedAddress}&petType=${petType}&page=${
      pageIndex + 1
    }&pageSize=${pageSize}`;
  };
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, getInfiniteFetcher);

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
      <CenterContainer>
        <span>조건에 맞는 펫시터가 없습니다</span>
      </CenterContainer>
    );
  }

  return (
    <PetsitterContainer>
      {data &&
        Array.isArray(data) &&
        data?.map((page) =>
          page?.map((petsitter: any) => <PetsitterCard key={petsitter.id} petsitter={petsitter} onNext={onNext} />),
        )}
      {!isEnd && (
        <CenterContainer ref={ref}>
          <Loading color="#279EFF" />
        </CenterContainer>
      )}
    </PetsitterContainer>
  );
}

const PetsitterContainer = styled(Column)`
  gap: 8px;
`;
