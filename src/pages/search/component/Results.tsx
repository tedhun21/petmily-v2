import { useSearchParams } from 'react-router-dom';
import useSWRInfinite from 'swr/infinite';

import styled from 'styled-components';

import { infiniteFetcher } from 'api';
import Result from './Result';
import { CenterContainer } from 'styles/commonStyle';
import Loading from '@components/Loading';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL;

export default function Results() {
  const [searchParams] = useSearchParams();
  const ref = useRef(null);
  const isInView = useInView(ref);

  const pageSize = 10;
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!searchParams || Array.from(searchParams).length === 0) return null;
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/users/petsitters/possible?${searchParams}&page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const { data, size, setSize, mutate } = useSWRInfinite(getKey, infiniteFetcher);

  const isEmpty = data?.[0]?.results?.length === 0;
  const isEnd = data && data[data.length - 1]?.results?.length < pageSize;

  if (isEmpty) {
    return (
      <CenterContainer>
        <span>펫시터를 찾을 수 없습니다</span>
      </CenterContainer>
    );
  }

  useEffect(() => {
    if (isInView) {
      setSize(size + 1);
    }
  }, [isInView]);

  return (
    <>
      {data && (
        <section>
          <ResultsList>
            {data[0].results.length > 0 &&
              Array.isArray(data[0].results) &&
              data.map((page: any) =>
                page?.results.map((petsitter: any) => <Result key={petsitter.id} petsitter={petsitter} />),
              )}
          </ResultsList>
        </section>
      )}

      {data && !isEnd && (
        <CenterContainer ref={ref}>
          <Loading color="#279EFF" />
        </CenterContainer>
      )}
    </>
  );
}

const ResultsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
